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
import {Oas20Response, Oas20ResponseBase, Oas20ResponseDefinition, OasDocument, OasNodePath} from "oai-ts-core";
import {SimplifiedType} from "../models/simplified-type.model";
import {MarshallUtils} from "../util/marshall.util";


/**
 * Factory function.
 */
export function createChangeResponseTypeCommand(document: OasDocument, response: Oas20Response | Oas20ResponseDefinition,
                                                newType: SimplifiedType): ChangeResponseTypeCommand_20 {
    if (document.getSpecVersion() === "2.0") {
        return new ChangeResponseTypeCommand_20(response, newType);
    } else {
        throw new Error("ChangeResponseType is unsupported for OpenAPI 3.0.x documents.");
    }
}

/**
 * Factory function.
 */
export function createChangeResponseDefinitionTypeCommand(document: OasDocument, response: Oas20ResponseDefinition,
                                                newType: SimplifiedType): ChangeResponseDefinitionTypeCommand_20 {
    if (document.getSpecVersion() === "2.0") {
        return new ChangeResponseDefinitionTypeCommand_20(response, newType);
    } else {
        throw new Error("ChangeResponseDefinitionTypeCommand is unsupported for OpenAPI 3.0.x documents.");
    }
}


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
        if (response) {
            this._responsePath = this.oasLibrary().createNodePath(response);
        }
        this._newType = newType;
    }

    /**
     * @return {string}
     */
    protected type(): string {
        return "ChangeResponseTypeCommand_20";
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
            if (this._newType.of) {
                if (this._newType.of.isSimpleType()) {
                    response.schema.items.type = this._newType.of.type;
                    response.schema.items.format = this._newType.of.as;
                }
                if (this._newType.of.isRef()) {
                    response.schema.items.$ref = this._newType.of.type;
                }
            }
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

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._responsePath = MarshallUtils.marshallNodePath(obj._responsePath);
        obj._newType = MarshallUtils.marshallSimplifiedParameterType(obj._newType);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._responsePath = MarshallUtils.unmarshallNodePath(this._responsePath as any);
        this._newType = MarshallUtils.unmarshallSimplifiedParameterType(this._newType);
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

    /**
     * @return {string}
     */
    protected type(): string {
        return "ChangeResponseDefinitionTypeCommand_20";
    }

}