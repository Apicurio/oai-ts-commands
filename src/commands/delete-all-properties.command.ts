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
    Oas20Schema,
    Oas20SchemaDefinition,
    Oas30Schema,
    Oas30SchemaDefinition,
    OasDocument,
    OasNodePath,
    OasSchema
} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";

export interface OldPropertySchema {
    name: string;
    schema: any;
}

/**
 * Factory function.
 */
export function createDeleteAllPropertiesCommand(document: OasDocument,
                                                 schema: Oas20Schema | Oas30Schema | Oas20SchemaDefinition | Oas30SchemaDefinition): DeleteAllPropertiesCommand {
    if (document.getSpecVersion() === "2.0") {
        return new DeleteAllPropertiesCommand_20(schema);
    } else {
        return new DeleteAllPropertiesCommand_30(schema);
    }
}

/**
 * A command used to delete all properties from a schema.
 */
export abstract class DeleteAllPropertiesCommand extends AbstractCommand implements ICommand {

    private _schemaPath: OasNodePath;

    private _oldProperties: OldPropertySchema[];

    /**
     * C'tor.
     * @param {OasSchema} schema
     */
    constructor(schema: Oas20Schema | Oas30Schema | Oas20SchemaDefinition | Oas30SchemaDefinition) {
        super();
        if (schema) {
            this._schemaPath = this.oasLibrary().createNodePath(schema);
        }
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

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._schemaPath = MarshallUtils.marshallNodePath(obj._schemaPath);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._schemaPath = MarshallUtils.unmarshallNodePath(this._schemaPath as any);
    }

}


/**
 * OAI 2.0 impl.
 */
export class DeleteAllPropertiesCommand_20 extends DeleteAllPropertiesCommand {

    protected type(): string {
        return "DeleteAllPropertiesCommand_20";
    }

}


/**
 * OAI 3.0 impl.
 */
export class DeleteAllPropertiesCommand_30 extends DeleteAllPropertiesCommand {

    protected type(): string {
        return "DeleteAllPropertiesCommand_30";
    }

}