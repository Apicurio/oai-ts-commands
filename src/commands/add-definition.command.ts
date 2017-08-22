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

import {Oas20Document, Oas20SchemaDefinition, Oas30Document, Oas30SchemaDefinition, OasDocument} from "oai-ts-core";
import {AbstractCommand, ICommand} from "../base";

/**
 * A command used to add a new definition in a document.  Source for the new
 * definition must be provided.  This source will be converted to an OAS
 * definition object and then added to the data model.
 */
export abstract class AbstractAddDefinitionCommand extends AbstractCommand implements ICommand {

    protected _defExisted: boolean;
    protected _newDefinitionName: string;
    protected _newDefinitionObj: any;

    /**
     * Constructor.
     * @param {string} definitionName
     * @param obj
     */
    constructor(definitionName: string, obj: any) {
        super();
        this._newDefinitionName = definitionName;
        this._newDefinitionObj = obj;
    }

    /**
     * Adds the new definition to the document.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[AddDefinitionCommand] Executing.");

        // Do nothing if the definition already exists.
        if (this.defExists(document)) {
            console.info("[AddDefinitionCommand] Definition with name %s already exists.", this._newDefinitionName);
            this._defExisted = true;
            return;
        }

        this.prepareDocumentForDef(document);

        let definition: Oas20SchemaDefinition | Oas30SchemaDefinition = this.createSchemaDefinition(document);
        this.addDefinition(document, definition);
    }

    /**
     * Removes the definition.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[AddDefinitionCommand] Reverting.");
        if (this._defExisted) {
            return;
        }

        this.removeDefinition(document);
    }

    protected abstract defExists(document: OasDocument): boolean;

    protected abstract prepareDocumentForDef(document: OasDocument): void;

    protected abstract createSchemaDefinition(document: OasDocument): Oas20SchemaDefinition | Oas30SchemaDefinition;

    protected abstract addDefinition(document: OasDocument, definition: Oas20SchemaDefinition | Oas30SchemaDefinition): void;

    protected abstract removeDefinition(document: OasDocument): void;
}


/**
 * OAI version 2.0 impl.
 */
export class AddDefinitionCommand_20 extends AbstractAddDefinitionCommand {

    private _nullDefinitions: boolean;

    protected defExists(document: Oas20Document): boolean {
        if (this.isNullOrUndefined(document.definitions)) {
            return false;
        }
        return !this.isNullOrUndefined(document.definitions.definition(this._newDefinitionName));
    }

    protected prepareDocumentForDef(document: Oas20Document): void {
        if (this.isNullOrUndefined(document.definitions)) {
            document.definitions = document.createDefinitions();
            this._nullDefinitions = true;
        }
    }

    protected createSchemaDefinition(document: Oas20Document): Oas20SchemaDefinition {
        let definition: Oas20SchemaDefinition = document.definitions.createSchemaDefinition(this._newDefinitionName);
        definition = this.oasLibrary().readNode(this._newDefinitionObj, definition) as Oas20SchemaDefinition;
        return definition;
    }

    protected addDefinition(document: Oas20Document, definition: Oas20SchemaDefinition): void {
        document.definitions.addDefinition(this._newDefinitionName, definition);
    }

    protected removeDefinition(document: Oas20Document): void {
        if (this._nullDefinitions) {
            document.definitions = null;
        } else {
            document.definitions.removeDefinition(this._newDefinitionName);
        }
    }

}


/**
 * OAI version 3.0.x impl.
 */
export class AddDefinitionCommand_30 extends AbstractAddDefinitionCommand {

    private _nullComponents: boolean;

    protected defExists(document: Oas30Document): boolean {
        if (this.isNullOrUndefined(document.components)) {
            return false;
        }
        return !this.isNullOrUndefined(document.components.getSchemaDefinition(this._newDefinitionName));
    }

    protected prepareDocumentForDef(document: Oas30Document): void {
        if (this.isNullOrUndefined(document.components)) {
            document.components = document.createComponents();
            this._nullComponents = true;
        } else {
            this._nullComponents = false;
        }
    }

    protected createSchemaDefinition(document: Oas30Document): Oas30SchemaDefinition | Oas30SchemaDefinition {
        let definition: Oas30SchemaDefinition = document.components.createSchemaDefinition(this._newDefinitionName);
        definition = this.oasLibrary().readNode(this._newDefinitionObj, definition) as Oas30SchemaDefinition;
        return definition;
    }

    protected addDefinition(document: Oas30Document, definition: Oas30SchemaDefinition): void {
        document.components.addSchemaDefinition(this._newDefinitionName, definition);
    }

    protected removeDefinition(document: Oas30Document): void {
        if (this._nullComponents) {
            document.components = null;
        } else {
            document.components.removeSchemaDefinition(this._newDefinitionName);
        }
    }

}
