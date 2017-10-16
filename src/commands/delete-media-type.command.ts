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
    Oas30MediaType,
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
export function createDeleteMediaTypeCommand(document: OasDocument, mediaType: Oas30MediaType): DeleteMediaTypeCommand {
    if (document.getSpecVersion() === "2.0") {
        throw new Error("Media Types are not supported in OpenAPI 2.0.");
    } else {
        return new DeleteMediaTypeCommand(mediaType);
    }
}

/**
 * A command used to delete a single mediaType from an operation.
 */
export class DeleteMediaTypeCommand extends AbstractCommand implements ICommand {

    private _mediaTypeName: string;
    private _mediaTypePath: OasNodePath;
    private _parentPath: OasNodePath;

    private _oldMediaType: any;

    /**
     * C'tor.
     * @param {Oas30MediaType} mediaType
     */
    constructor(mediaType: Oas30MediaType) {
        super();
        if (mediaType) {
            this._mediaTypeName = mediaType.name();
            this._mediaTypePath = this.oasLibrary().createNodePath(mediaType);
            this._parentPath = this.oasLibrary().createNodePath(mediaType.parent());
        }
    }

    protected type(): string {
        return "DeleteMediaTypeCommand";
    }

    /**
     * Deletes the mediaType.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteMediaTypeCommand] Executing.");
        this._oldMediaType = null;

        let mediaType: Oas30MediaType = this._mediaTypePath.resolve(document) as Oas30MediaType;
        if (this.isNullOrUndefined(mediaType)) {
            return;
        }

        let parent: Oas30ParameterBase | Oas30RequestBody | Oas30ResponseBase = mediaType.parent() as any;
        parent.removeMediaType(this._mediaTypeName);

        this._oldMediaType = this.oasLibrary().writeNode(mediaType);
    }

    /**
     * Restore the old (deleted) parameters.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteMediaTypeCommand] Reverting.");
        if (this.isNullOrUndefined(this._oldMediaType)) {
            return;
        }

        let parent: Oas30ParameterBase | Oas30RequestBody | Oas30ResponseBase = this._parentPath.resolve(document) as any;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        let mediaType: Oas30MediaType = parent.createMediaType(this._mediaTypeName);
        this.oasLibrary().readNode(this._oldMediaType, mediaType);
        parent.addMediaType(this._mediaTypeName, mediaType);
    }

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._mediaTypePath = MarshallUtils.marshallNodePath(obj._mediaTypePath);
        obj._parentPath = MarshallUtils.marshallNodePath(obj._parentPath);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._mediaTypePath = MarshallUtils.unmarshallNodePath(this._mediaTypePath as any);
        this._parentPath = MarshallUtils.unmarshallNodePath(this._parentPath as any);
    }

}

