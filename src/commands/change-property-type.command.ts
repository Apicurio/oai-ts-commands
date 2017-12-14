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
import {SimplifiedPropertyType, SimplifiedType} from "../models/simplified-type.model";
import {MarshallUtils} from "../util/marshall.util";


/**
 * Factory function.
 */
export function createChangePropertyTypeCommand(document: OasDocument,
                                                property: Oas20PropertySchema | Oas30PropertySchema,
                                                newType: SimplifiedPropertyType): ChangePropertyTypeCommand {
    if (document.getSpecVersion() === "2.0") {
        return new ChangePropertyTypeCommand_20(property, newType);
    } else {
        return new ChangePropertyTypeCommand_30(property, newType);
    }
}

/**
 * A command used to modify the type of a property of a schema.
 */
export abstract class ChangePropertyTypeCommand extends AbstractCommand implements ICommand {

    private _propPath: OasNodePath;
    private _propName: string;
    private _newType: SimplifiedPropertyType;

    protected _oldProperty: any;
    protected _oldRequired: boolean;
    protected _nullRequired: boolean;

    /**
     * C'tor.
     * @param {Oas20PropertySchema | Oas30PropertySchema} property
     * @param {SimplifiedPropertyType} newType
     */
    constructor(property: Oas20PropertySchema | Oas30PropertySchema, newType: SimplifiedPropertyType) {
        super();
        if (property) {
            this._propName = property.propertyName();
            this._propPath = this.oasLibrary().createNodePath(property);
        }
        this._newType = newType;
    }

    /**
     * Modifies the type of an operation's property.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangePropertyTypeCommand] Executing: " + this._newType);
        let prop: Oas20PropertySchema | Oas30PropertySchema = this._propPath.resolve(document) as any;
        if (this.isNullOrUndefined(prop)) {
            return;
        }

        let required: string[] = prop.parent()["required"];

        // Save the old info (for later undo operation)
        this._oldProperty = this.oasLibrary().writeNode(prop);
        this._oldRequired = required && required.length > 0 && required.indexOf(prop.propertyName()) != -1;

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

        if (!this.isNullOrUndefined(this._newType.required)) {
            // Going from optional to required
            if (this._newType.required && !this._oldRequired) {
                if (this.isNullOrUndefined(required)) {
                    required = [];
                    prop.parent()["required"] = required;
                    this._nullRequired = true;
                }
                required.push(prop.propertyName());
            }
            // Going from required to optional
            if (!this._newType.required && this._oldRequired) {
                required.splice(required.indexOf(prop.propertyName()), 1);
            }
        }
    }

    /**
     * Resets the prop type back to its previous state.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangePropertyTypeCommand] Reverting.");
        let prop: Oas20PropertySchema | Oas30PropertySchema = this._propPath.resolve(document) as any;
        if (this.isNullOrUndefined(prop)) {
            return;
        }

        let required: string[] = prop.parent()["required"];
        let wasRequired: boolean = required && required.length > 0 && required.indexOf(prop.propertyName()) != -1;

        let parentSchema: OasSchema = prop.parent() as OasSchema;
        let oldProp: OasSchema = parentSchema.createPropertySchema(this._propName);
        this.oasLibrary().readNode(this._oldProperty, oldProp);
        parentSchema.removeProperty(this._propName);
        parentSchema.addProperty(this._propName, oldProp);

        if (!this.isNullOrUndefined(this._newType.required)) {
            if (this._nullRequired) {
                prop.parent()["required"] = null;
            } else {
                // Restoring optional from required
                if (wasRequired && !this._oldRequired) {
                    required.splice(required.indexOf(prop.propertyName()), 1);
                }
                // Restoring required from optional
                if (!wasRequired && this._oldRequired) {
                    required.push(prop.propertyName());
                }
            }
        }
    }

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._propPath = MarshallUtils.marshallNodePath(obj._propPath);
        obj._newType = MarshallUtils.marshallSimplifiedParameterType(obj._newType);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._propPath = MarshallUtils.unmarshallNodePath(this._propPath as any);
        this._newType = MarshallUtils.unmarshallSimplifiedParameterType(this._newType);
    }

}


/**
 * OAI 2.0 impl.
 */
export class ChangePropertyTypeCommand_20 extends ChangePropertyTypeCommand {

    protected type(): string {
        return "ChangePropertyTypeCommand_20";
    }

}


/**
 * OAI 3.0 impl.
 */
export class ChangePropertyTypeCommand_30 extends ChangePropertyTypeCommand {

    protected type(): string {
        return "ChangePropertyTypeCommand_30";
    }

}