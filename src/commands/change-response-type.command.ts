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
    Oas20Document, Oas20Response, Oas20ResponseBase, Oas20ResponseDefinition, Oas20Schema, Oas30Response, OasDocument,
    OasNodePath
} from "oai-ts-core";
import {SimplifiedType} from "../models/simplified-type.model";

/**
 * A command used to modify the type of a response.
 */
export class ChangeResponseTypeCommand_20 extends AbstractCommand implements ICommand {

    private _responsePath: OasNodePath;
    private _newType: SimplifiedType;

    private _oldSchema: any;

    /**
     * C'tor.
     * @param {Oas20Response | Oas20ResponseDefinition} response
     * @param {SimplifiedType} newType
     */
    constructor(response: Oas20Response | Oas20ResponseDefinition, newType: SimplifiedType) {
        super();
        this._responsePath = this.oasLibrary().createNodePath(response);
        this._newType = newType;
    }

    /**
     * Modifies the type of an operation's response.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangeResponseTypeCommand] Executing.");
        let response: Oas20ResponseBase = this._responsePath.resolve(document) as Oas20ResponseBase;
        if (!response) {
            return;
        }

        this._oldSchema = null;
        if (response.schema) {
            this._oldSchema = this.oasLibrary().writeNode(response.schema);
        }

        response.schema = response.createSchema();

        if (this._newType.isSimpleType()) {
            response.schema.type = this._newType.type;
            response.schema.format = this._newType.as;
        }
        if (this._newType.isRef()) {
            response.schema.$ref = this._newType.type;
        }
        if (this._newType.isArray()) {
            response.schema.type = "array";
            response.schema.items = response.schema.createItemsSchema();
            response.schema.items.type = this._newType.of.type;
            response.schema.items.format = this._newType.of.as;
        }
    }

    /**
     * Resets the response type back to its previous state.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangeResponseTypeCommand] Reverting.");
        let response: Oas20ResponseBase = this._responsePath.resolve(document) as Oas20ResponseBase;
        if (!response) {
            return;
        }

        if (this._oldSchema) {
            response.schema = response.createSchema();
            this.oasLibrary().readNode(this._oldSchema, response.schema);
        } else {
            response.schema = null;
        }
    }

}


/**
 * Changes the type of a response definition.
 */
export class ChangeResponseDefinitionTypeCommand_20 extends ChangeResponseTypeCommand_20 {

    /**
     * C'tor.
     * @param {Oas20Response | Oas20ResponseDefinition} response
     * @param {SimplifiedType} newType
     */
    constructor(response: Oas20ResponseDefinition, newType: SimplifiedType) {
        super(response, newType);
    }

}