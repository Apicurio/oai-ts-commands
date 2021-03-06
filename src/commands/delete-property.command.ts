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
import {Oas20PropertySchema, Oas30PropertySchema, OasDocument, OasNodePath, OasSchema} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";

/**
 * Factory function.
 */
export function createDeletePropertyCommand(document: OasDocument, property: Oas20PropertySchema | Oas30PropertySchema): DeletePropertyCommand {
    if (document.getSpecVersion() === "2.0") {
        return new DeletePropertyCommand_20(property);
    } else {
        return new DeletePropertyCommand_30(property);
    }
}

/**
 * A command used to delete a single property from a schema.
 */
export abstract class DeletePropertyCommand extends AbstractCommand implements ICommand {

    private _propertyName: string;
    private _propertyPath: OasNodePath;
    private _schemaPath: OasNodePath;

    private _oldProperty: any;
    private _oldRequired: boolean;

    /**
     * C'tor.
     * @param {Oas20PropertySchema | Oas30PropertySchema} property
     */
    constructor(property: Oas20PropertySchema | Oas30PropertySchema) {
        super();
        if (property) {
            this._propertyName = property.propertyName();
            this._propertyPath = this.oasLibrary().createNodePath(property);
            this._schemaPath = this.oasLibrary().createNodePath(property.parent());
        }
    }

    /**
     * Deletes the property.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeletePropertyCommand] Executing.");
        this._oldProperty = null;

        let property: Oas20PropertySchema | Oas30PropertySchema = this._propertyPath.resolve(document) as any;
        if (this.isNullOrUndefined(property)) {
            return;
        }

        let schema: OasSchema = property.parent() as OasSchema;
        this._oldProperty = this.oasLibrary().writeNode(schema.removeProperty(this._propertyName));
        this._oldRequired = schema.required && schema.required.indexOf(this._propertyName) !== -1;
        if (this._oldRequired) {
            schema.required.splice(schema.required.indexOf(this._propertyName), 1);
        }
    }

    /**
     * Restore the old (deleted) property.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeletePropertyCommand] Reverting.");
        if (!this._oldProperty) {
            return;
        }

        let schema: OasSchema = this._schemaPath.resolve(document) as OasSchema;
        if (this.isNullOrUndefined(schema)) {
            return;
        }

        let propSchema: OasSchema = schema.createPropertySchema(this._propertyName);
        this.oasLibrary().readNode(this._oldProperty, propSchema);
        schema.addProperty(this._propertyName, propSchema);
        if (this._oldRequired) {
            if (!schema.required) {
                schema.required = [];
            }
            schema.required.push(this._propertyName);
        }
    }

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._propertyPath = MarshallUtils.marshallNodePath(obj._propertyPath);
        obj._schemaPath = MarshallUtils.marshallNodePath(obj._schemaPath);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._propertyPath = MarshallUtils.unmarshallNodePath(this._propertyPath as any);
        this._schemaPath = MarshallUtils.unmarshallNodePath(this._schemaPath as any);
    }

}


/**
 * OAI 2.0 impl.
 */
export class DeletePropertyCommand_20 extends DeletePropertyCommand {

    protected type(): string {
        return "DeletePropertyCommand_20";
    }

}


/**
 * OAI 3.0 impl.
 */
export class DeletePropertyCommand_30 extends DeletePropertyCommand {

    protected type(): string {
        return "DeletePropertyCommand_30";
    }

}
