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
    Oas20Schema, Oas20SchemaDefinition, Oas30Schema, Oas30SchemaDefinition, OasDocument, OasNodePath,
    OasSchema
} from "oai-ts-core";

export class OldPropertySchema {
    name: string;
    schema: any;
}

/**
 * A command used to delete all properties from a schema.
 */
export abstract class AbstractDeleteAllPropertiesCommand extends AbstractCommand implements ICommand {

    private _schemaPath: OasNodePath;

    private _oldProperties: OldPropertySchema[];

    /**
     * C'tor.
     * @param {OasSchema} schema
     */
    constructor(schema: Oas20Schema | Oas30Schema | Oas20SchemaDefinition | Oas30SchemaDefinition) {
        super();
        this._schemaPath = this.oasLibrary().createNodePath(schema);
    }

    /**
     * Deletes the properties.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteAllPropertiesCommand] Executing.");
        this._oldProperties = [];

        let schema: OasSchema = this._schemaPath.resolve(document) as OasSchema;

        if (this.isNullOrUndefined(schema)) {
            return;
        }

        schema.propertyNames().forEach( pname => {
            this._oldProperties.push({
                name: pname,
                schema: this.oasLibrary().writeNode(schema.removeProperty(pname))
            });
        });
    }

    /**
     * Restore the old (deleted) property.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteAllPropertiesCommand] Reverting.");
        if (this._oldProperties.length === 0) {
            return;
        }

        let schema: OasSchema = this._schemaPath.resolve(document) as OasSchema;
        if (this.isNullOrUndefined(schema)) {
            return;
        }

        this._oldProperties.forEach( oldProp => {
            let prop: OasSchema = schema.createPropertySchema(oldProp.name)
            this.oasLibrary().readNode(oldProp.schema, prop);
            schema.addProperty(oldProp.name, prop);
        });
    }

}


/**
 * OAI 2.0 impl.
 */
export class DeleteAllPropertiesCommand_20 extends AbstractDeleteAllPropertiesCommand {

}


/**
 * OAI 3.0 impl.
 */
export class DeleteAllPropertiesCommand_30 extends AbstractDeleteAllPropertiesCommand {

}