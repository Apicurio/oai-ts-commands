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
    Oas20Definitions,
    Oas20Document,
    Oas20SchemaDefinition,
    Oas30Document,
    Oas30SchemaDefinition,
    OasDocument
} from "oai-ts-core";

/**
 * Factory function.
 */
export function createDeleteSchemaDefinitionCommand(document: OasDocument, definitionName: string): DeleteSchemaDefinitionCommand {
    if (document.getSpecVersion() === "2.0") {
        return new DeleteSchemaDefinitionCommand_20(definitionName);
    } else {
        return new DeleteSchemaDefinitionCommand_30(definitionName);
    }
}

/**
 * A command used to delete a schema definition.
 */
export abstract class DeleteSchemaDefinitionCommand extends AbstractCommand implements ICommand {

    protected _definitionName: string;

    private _oldDefinition: any;

    /**
     * C'tor.
     * @param {string} definitionName
     */
    constructor(definitionName: string) {
        super();
        this._definitionName = definitionName;
    }

    /**
     * Deletes the definition.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteDefinitionSchemaCommand] Executing.");
        this._oldDefinition = this.doDeleteSchemaDefinition(document);
    }

    /**
     * Restore the old (deleted) definition.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteDefinitionSchemaCommand] Reverting.");
        if (this._oldDefinition === null) {
            return;
        }

        this.doRestoreSchemaDefinition(document, this._oldDefinition);
    }

    /**
     * Deletes the schema definition.
     * @param {OasDocument} document
     * @return {any}
     */
    protected abstract doDeleteSchemaDefinition(document: OasDocument): any;

    /**
     * Restores the schema definition previously deleted.
     * @param {OasDocument} document
     * @param oldDefinition
     */
    protected abstract doRestoreSchemaDefinition(document: OasDocument, oldDefinition: any): void;
}


/**
 * OAI 2.0 impl.
 */
export class DeleteSchemaDefinitionCommand_20 extends DeleteSchemaDefinitionCommand {

    protected type(): string {
        return "DeleteSchemaDefinitionCommand_20";
    }

    /**
     * Deletes the schema definition.
     * @param {Oas20Document} document
     * @return {any}
     */
    protected doDeleteSchemaDefinition(document: Oas20Document): any {
        let definitions: Oas20Definitions = document.definitions;
        if (this.isNullOrUndefined(definitions)) {
            return null;
        }
        let schemaDef: Oas20SchemaDefinition = definitions.removeDefinition(this._definitionName);
        return this.oasLibrary().writeNode(schemaDef);
    }

    /**
     * Restores the schema definition.
     * @param {OasDocument} document
     * @param oldDefinition
     */
    protected doRestoreSchemaDefinition(document: Oas20Document, oldDefinition: any): void {
        let definitions: Oas20Definitions = document.definitions;
        if (this.isNullOrUndefined(definitions)) {
            return;
        }

        let definition: Oas20SchemaDefinition = document.definitions.createSchemaDefinition(this._definitionName);
        this.oasLibrary().readNode(oldDefinition, definition);
        definitions.addDefinition(this._definitionName, definition);
    }

}


/**
 * OAI 3.0 impl.
 */
export class DeleteSchemaDefinitionCommand_30 extends DeleteSchemaDefinitionCommand {

    protected type(): string {
        return "DeleteSchemaDefinitionCommand_30";
    }

    /**
     * Deletes the schema definition.
     * @param {OasDocument} document
     * @return {any}
     */
    protected doDeleteSchemaDefinition(document: Oas30Document): any {
        if (document.components) {
            let oldDef: Oas30SchemaDefinition = document.components.removeSchemaDefinition(this._definitionName);
            return this.oasLibrary().writeNode(oldDef);
        }
        return null;
    }

    /**
     * Restores the schema definition.
     * @param {OasDocument} document
     * @param oldDefinition
     */
    protected doRestoreSchemaDefinition(document: Oas30Document, oldDefinition: any): void {
        if (document.components) {
            let schemaDef: Oas30SchemaDefinition = document.components.createSchemaDefinition(this._definitionName);
            this.oasLibrary().readNode(oldDefinition, schemaDef);
            document.components.addSchemaDefinition(this._definitionName, schemaDef);
        }
    }

}
