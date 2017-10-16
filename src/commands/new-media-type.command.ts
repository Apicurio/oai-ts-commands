/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {AbstractCommand, ICommand} from "../base";
import {
    Oas30Document,
    Oas30ParameterBase,
    Oas30RequestBody,
    Oas30ResponseBase,
    OasDocument,
    OasNodePath
} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";

/**
 * Factory function.
 */
export function createNewMediaTypeCommand(document: OasDocument,
                                          node: Oas30ParameterBase | Oas30RequestBody | Oas30ResponseBase,
                                          newMediaType: string): NewMediaTypeCommand {
    if (document.getSpecVersion() === "2.0") {
        throw new Error("Media Types were introduced in OpenAPI 3.0.0.");
    } else {
        return new NewMediaTypeCommand(node, newMediaType);
    }
}

/**
 * A command used to create a new media type.
 */
export class NewMediaTypeCommand extends AbstractCommand implements ICommand {

    private _nodePath: OasNodePath;
    private _newMediaType: string;

    private _created: boolean;

    /**
     * C'tor.
     * @param {Oas30ParameterBase | Oas30RequestBody | Oas30ResponseBase} node
     * @param {string} newMediaType
     */
    constructor(node: Oas30ParameterBase | Oas30RequestBody | Oas30ResponseBase, newMediaType: string) {
        super();
        if (node) {
            this._nodePath = this.oasLibrary().createNodePath(node);
        }
        this._newMediaType = newMediaType;
    }

    /**
     * @return {string}
     */
    protected type(): string {
        return "NewMediaTypeCommand";
    }

    /**
     * Adds the new media type to the node.
     * @param {Oas30Document} document
     */
    public execute(document: Oas30Document): void {
        console.info("[NewMediaTypeCommand] Executing.");
        this._created = false;

        let node: Oas30ParameterBase | Oas30RequestBody | Oas30ResponseBase = this._nodePath.resolve(document) as any;
        if (this.isNullOrUndefined(node)) {
            return;
        }

        if (!this.isNullOrUndefined(node.content[this._newMediaType])) {
            return;
        }

        node.addMediaType(this._newMediaType, node.createMediaType(this._newMediaType));
        this._created = true;
    }

    /**
     * Removes the path item.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[NewMediaTypeCommand] Reverting.");
        if (!this._created) {
            console.info("[NewMediaTypeCommand] media type already existed, nothing done so no rollback necessary.");
            return;
        }

        let node: Oas30ParameterBase | Oas30RequestBody | Oas30ResponseBase = this._nodePath.resolve(document) as any;
        if (this.isNullOrUndefined(node)) {
            return;
        }

        node.removeMediaType(this._newMediaType);
    }

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._nodePath = MarshallUtils.marshallNodePath(obj._nodePath);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._nodePath = MarshallUtils.unmarshallNodePath(this._nodePath as any);
    }

}
