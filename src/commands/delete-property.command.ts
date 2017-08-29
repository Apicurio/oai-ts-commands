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

    /**
     * C'tor.
     * @param {Oas20PropertySchema | Oas30PropertySchema} property
     */
    constructor(property: Oas20PropertySchema | Oas30PropertySchema) {
        super();
        this._propertyName = property.propertyName();
        this._propertyPath = this.oasLibrary().createNodePath(property);
        this._schemaPath = this.oasLibrary().createNodePath(property.parent());
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
    }

}


/**
 * OAI 2.0 impl.
 */
export class DeletePropertyCommand_20 extends DeletePropertyCommand {

}


/**
 * OAI 3.0 impl.
 */
export class DeletePropertyCommand_30 extends DeletePropertyCommand {

}
