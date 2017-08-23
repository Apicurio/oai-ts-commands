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

import {Oas20PropertySchema, Oas30PropertySchema, OasDocument, OasNodePath, OasSchema} from "oai-ts-core";
import {AbstractCommand, ICommand} from "../base";
import {SimplifiedType} from "../models/simplified-type.model";

/**
 * A command used to modify the type of a property of a schema.
 */
export abstract class AbstractChangePropertyTypeCommand extends AbstractCommand implements ICommand {

    private _propPath: OasNodePath;
    private _propName: string;
    private _newType: SimplifiedType;

    protected _oldProperty: any;

    /**
     * C'tor.
     * @param {Oas20PropertySchema | Oas30PropertySchema} property
     * @param {SimplifiedType} newType
     */
    constructor(property: Oas20PropertySchema | Oas30PropertySchema, newType: SimplifiedType) {
        super();
        this._propName = property.propertyName();
        this._propPath = this.oasLibrary().createNodePath(property);
        this._newType = newType;
    }

    /**
     * Modifies the type of an operation's property.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangePropertyTypeCommand] Executing: " + this._newType);
        let prop: OasSchema = this._propPath.resolve(document) as OasSchema;
        if (!prop) {
            return;
        }

        // Save the old info (for later undo operation)
        this._oldProperty = this.oasLibrary().writeNode(prop);

        // Update the schema's type
        if (this._newType.isSimpleType()) {
            prop.$ref = null;
            prop.type = this._newType.type;
            prop.format = this._newType.as;
            prop.items = null;
        }
        if (this._newType.isRef()) {
            prop.$ref = this._newType.type;
            prop.type = null;
            prop.format = null;
            prop.items = null;
        }
        if (this._newType.isArray()) {
            prop.$ref = null;
            prop.type = "array";
            prop.format = null;
            prop.items = prop.createItemsSchema();
            if (this._newType.of) {
                if (this._newType.of.isRef()) {
                    prop.items.$ref = this._newType.of.type;
                } else {
                    prop.items.type = this._newType.of.type;
                    prop.items.format = this._newType.of.as;
                }
            }
        }
    }

    /**
     * Resets the prop type back to its previous state.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangePropertyTypeCommand] Reverting.");
        let prop: OasSchema = this._propPath.resolve(document) as OasSchema;
        if (!prop) {
            return;
        }

        let parentSchema: OasSchema = prop.parent() as OasSchema;
        let oldProp: OasSchema = parentSchema.createPropertySchema(this._propName);
        this.oasLibrary().readNode(this._oldProperty, oldProp);
        parentSchema.removeProperty(this._propName);
        parentSchema.addProperty(this._propName, oldProp);
    }

}


/**
 * OAI 2.0 impl.
 */
export class ChangePropertyTypeCommand_20 extends AbstractChangePropertyTypeCommand {

}


/**
 * OAI 3.0 impl.
 */
export class ChangePropertyTypeCommand_30 extends AbstractChangePropertyTypeCommand {

}