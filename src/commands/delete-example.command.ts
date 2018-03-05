/**
 * @license
 * Copyright 2018 JBoss Inc
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
import {Oas30Example, Oas30MediaType, OasDocument, OasNodePath} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";

/**
 * Factory function.
 */
export function createDeleteExampleCommand(document: OasDocument, example: Oas30Example): DeleteExampleCommand_30 {
    if (document.getSpecVersion() === "2.0") {
        throw new Error("Media Types are not supported in OpenAPI 2.0.");
    } else {
        return new DeleteExampleCommand_30(example);
    }
}

/**
 * A command used to delete a single mediaType from an operation.
 */
export class DeleteExampleCommand_30 extends AbstractCommand implements ICommand {

    private _exampleName: string;
    private _mediaTypePath: OasNodePath;

    private _oldExample: any;

    /**
     * C'tor.
     * @param {Oas30Example} example
     */
    constructor(example: Oas30Example) {
        super();
        if (!this.isNullOrUndefined(example)) {
            this._exampleName = example.name();
            this._mediaTypePath = this.oasLibrary().createNodePath(example.parent());
        }
    }

    protected type(): string {
        return "DeleteExampleCommand_30";
    }

    /**
     * Deletes the example.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteExampleCommand] Executing.");
        this._oldExample = null;

        let mediaType: Oas30MediaType = this._mediaTypePath.resolve(document) as Oas30MediaType;
        if (this.isNullOrUndefined(mediaType) || this.isNullOrUndefined(mediaType.getExample(this._exampleName))) {
            console.debug("[DeleteExampleCommand] No example named: " + this._exampleName);
            return;
        }

        console.info("[DeleteExampleCommand] Removing example.");
        let example: Oas30Example = mediaType.removeExample(this._exampleName);
        this._oldExample = this.oasLibrary().writeNode(example);
        console.info("[DeleteExampleCommand] Old Example: " + JSON.stringify(this._oldExample));
    }

    /**
     * Restore the old (deleted) example.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteExampleCommand] Reverting.");
        if (this.isNullOrUndefined(this._oldExample)) {
            return;
        }

        let mediaType: Oas30MediaType = this._mediaTypePath.resolve(document) as any;
        if (this.isNullOrUndefined(mediaType)) {
            console.info("[DeleteExampleCommand] No media type found.");
            return;
        }

        let example: Oas30Example = mediaType.createExample(this._exampleName);
        this.oasLibrary().readNode(this._oldExample, example);
        mediaType.addExample(example);
        console.info("[DeleteExampleCommand] Example added: " + JSON.stringify(this.oasLibrary().writeNode(mediaType)));
    }

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._mediaTypePath = MarshallUtils.marshallNodePath(obj._mediaTypePath);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._mediaTypePath = MarshallUtils.unmarshallNodePath(this._mediaTypePath as any);
    }

}

