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
    Oas20Parameter, Oas20PropertySchema,
    Oas20Schema,
    Oas30Parameter, Oas30PropertySchema,
    Oas30Schema,
    OasDocument,
    OasNodePath,
    OasSchema
} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";
import {SimplifiedParameterType, SimplifiedPropertyType} from "../models/simplified-type.model";

/**
 * Factory function.
 */
export function createNewSchemaPropertyCommand(document: OasDocument, schema: Oas20Schema | Oas30Schema,
                                               propertyName: string, description?: string, newType?: SimplifiedPropertyType): NewSchemaPropertyCommand {
    if (document.getSpecVersion() === "2.0") {
        return new NewSchemaPropertyCommand_20(schema, propertyName, description, newType);
    } else {
        return new NewSchemaPropertyCommand_30(schema, propertyName, description, newType);
    }
}

/**
 * A command used to create a new schema property.
 */
export abstract class NewSchemaPropertyCommand extends AbstractCommand implements ICommand {

    private _propertyName: string;
    private _schemaPath: OasNodePath;
    private _description: string;
    private _newType: SimplifiedPropertyType;

    private _created: boolean;
    protected _nullRequired: boolean;

    /**
     * Constructor.
     * @param schema
     * @param propertyName
     * @param description
     * @param newType
     */
    constructor(schema: Oas20Schema | Oas30Schema, propertyName: string, description: string, newType: SimplifiedParameterType) {
        super();
        if (schema) {
            this._schemaPath = this.oasLibrary().createNodePath(schema);
        }
        this._propertyName = propertyName;
        this._description = description;
        this._newType = newType;
    }

    /**
     * Creates a new property of the schema.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[NewSchemaPropertyCommand] Executing.");

        this._created = false;

        let schema: OasSchema = this._schemaPath.resolve(document) as OasSchema;
        if (this.isNullOrUndefined(schema)) {
            console.info("[NewSchemaPropertyCommand] Schema is null.");
            return;
        }

        if (schema.property(this._propertyName)) {
            console.info("[NewSchemaPropertyCommand] Property already exists.");
            return;
        }

        let property: OasSchema = schema.createPropertySchema(this._propertyName);
        if (this._description) {
            property.description = this._description;
        }
        if (this._newType) {
            this._setPropertyType(property as Oas20PropertySchema | Oas30PropertySchema);
        }
        schema.addProperty(this._propertyName, property);
        console.info("[NewSchemaPropertyCommand] Property [%s] created successfully.", this._propertyName);

        this._created = true;
    }

    /**
     * Sets the property type.
     * @param property
     */
    protected _setPropertyType(prop: Oas20PropertySchema | Oas30PropertySchema): void {
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

        if (this._newType && this._newType.required) {
            let required: string[] = prop.parent()["required"];
            if (this.isNullOrUndefined(required)) {
                required = [];
                prop.parent()["required"] = required;
                this._nullRequired = true;
            }
            required.push(prop.propertyName());
        }
    }

    /**
     * Removes the previously created property.
     * @property document
     */
    public undo(document: OasDocument): void {
        console.info("[NewSchemaPropertyCommand] Reverting.");
        if (!this._created) {
            return;
        }

        let schema: OasSchema = this._schemaPath.resolve(document) as OasSchema;
        if (this.isNullOrUndefined(schema)) {
            return;
        }

        if (!schema.property(this._propertyName)) {
            return;
        }

        schema.removeProperty(this._propertyName);

        // if the property was marked as required - need to remove it from the parent's "required" array
        if (this._newType && this._newType.required) {
            let required: string[] = schema["required"];
            required.splice(required.indexOf(this._propertyName), 1);
        }
    }

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._schemaPath = MarshallUtils.marshallNodePath(obj._schemaPath);
        obj._newType = MarshallUtils.marshallSimplifiedParameterType(obj._newType);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._schemaPath = MarshallUtils.unmarshallNodePath(this._schemaPath as any);
        this._newType = MarshallUtils.unmarshallSimplifiedParameterType(this._newType);
    }


}


/**
 * OAI 2.0 impl.
 */
export class NewSchemaPropertyCommand_20 extends NewSchemaPropertyCommand {

    protected type(): string {
        return "NewSchemaPropertyCommand_20";
    }

}


/**
 * OAI 3.0 impl.
 */
export class NewSchemaPropertyCommand_30 extends NewSchemaPropertyCommand {

    protected type(): string {
        return "NewSchemaPropertyCommand_30";
    }

}

