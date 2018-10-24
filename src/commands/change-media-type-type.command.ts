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

import {Oas30MediaType, OasDocument, OasNodePath} from "oai-ts-core";
import {AbstractCommand, ICommand} from "../base";
import {SimplifiedType} from "../models/simplified-type.model";
import {MarshallUtils} from "../util/marshall.util";
import {SimplifiedTypeUtil} from "../util/model.util";

/**
 * Factory function.
 */
export function createChangeMediaTypeTypeCommand(document: OasDocument, mediaType: Oas30MediaType,
                                                 newType: SimplifiedType): ChangeMediaTypeTypeCommand {
    if (document.getSpecVersion() === "2.0") {
        throw new Error("Media Types not supported in OpenAPI 2.0");
    } else {
        return new ChangeMediaTypeTypeCommand(mediaType, newType);
    }
}

/**
 * A command used to modify the type of a mediaType of a schema.
 */
export class ChangeMediaTypeTypeCommand extends AbstractCommand implements ICommand {

    private _mediaTypePath: OasNodePath;
    private _mediaTypeName: string;
    private _newType: SimplifiedType;

    protected _changed: boolean;
    protected _oldMediaTypeSchema: any;

    /**
     * C'tor.
     * @param {Oas20MediaTypeSchema | Oas30MediaTypeSchema} mediaType
     * @param {SimplifiedType} newType
     */
    constructor(mediaType: Oas30MediaType, newType: SimplifiedType) {
        super();
        if (mediaType) {
            this._mediaTypeName = mediaType.name();
            this._mediaTypePath = this.oasLibrary().createNodePath(mediaType);
        }
        this._newType = newType;
    }

    /**
     * @return {string}
     */
    protected type(): string {
        return "ChangeMediaTypeTypeCommand";
    }

    /**
     * Modifies the type/schema of a Media Type.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangeMediaTypeTypeCommand] Executing.");
        this._changed = false;

        let mediaType: Oas30MediaType = this._mediaTypePath.resolve(document) as Oas30MediaType;
        if (!mediaType) {
            return;
        }

        // Save the old info (for later undo operation)
        if (this.isNullOrUndefined(mediaType.schema)) {
            this._oldMediaTypeSchema = null;
            mediaType.schema = mediaType.createSchema();
        } else {
            this._oldMediaTypeSchema = this.oasLibrary().writeNode(mediaType.schema);
        }

        // Update the media type schema's type
        SimplifiedTypeUtil.setSimplifiedType(mediaType.schema, this._newType);

        this._changed = true;
    }

    /**
     * Resets the prop type back to its previous state.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangeMediaTypeTypeCommand] Reverting.");
        if (!this._changed) {
            return;
        }

        let mediaType: Oas30MediaType = this._mediaTypePath.resolve(document) as Oas30MediaType;
        if (!mediaType) {
            return;
        }

        if (this._oldMediaTypeSchema === null) {
            mediaType.schema = null;
        } else {
            mediaType.schema = mediaType.createSchema();
            this.oasLibrary().readNode(this._oldMediaTypeSchema, mediaType.schema);
        }
    }

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._mediaTypePath = MarshallUtils.marshallNodePath(obj._mediaTypePath);
        obj._newType = MarshallUtils.marshallSimplifiedType(obj._newType);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._mediaTypePath = MarshallUtils.unmarshallNodePath(this._mediaTypePath as any);
        this._newType = MarshallUtils.unmarshallSimplifiedType(this._newType);
    }

}
