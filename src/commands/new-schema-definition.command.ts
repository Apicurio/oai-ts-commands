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
    Oas20Document,
    Oas20SchemaDefinition,
    Oas30Document,
    Oas30SchemaDefinition,
    OasDocument,
    OasSchemaFactory
} from "oai-ts-core";


/**
 * Factory function.
 */
export function createNewSchemaDefinitionCommand(document: OasDocument, definitionName: string, example?: string | any,
                                                 description?: string): NewSchemaDefinitionCommand {
    if (document.getSpecVersion() === "2.0") {
        return new NewSchemaDefinitionCommand_20(definitionName, example, description);
    } else {
        return new NewSchemaDefinitionCommand_30(definitionName, example, description);
    }
}

/**
 * A command used to create a new definition in a document.
 */
export abstract class NewSchemaDefinitionCommand extends AbstractCommand implements ICommand {

    protected _newDefinitionName: string;
    protected _newDefinitionExample: string | any;
    protected _newDefinitionDescription: string;

    protected _defExisted: boolean;

    /**
     * C'tor.
     * @param {string} definitionName
     * @param {string} example
     */
    constructor(definitionName: string, example?: string | any, description?: string) {
        super();
        this._newDefinitionName = definitionName;
        this._newDefinitionExample = example;
        this._newDefinitionDescription = description;
    }

    public abstract execute(document: OasDocument): void;

    public abstract undo(document: OasDocument): void;

}

/**
 * OAI 2.0 impl.
 */
export class NewSchemaDefinitionCommand_20 extends NewSchemaDefinitionCommand {

    protected _nullDefinitions: boolean;

    protected type(): string {
        return "NewSchemaDefinitionCommand_20";
    }

    /**
     * Adds the new definition to the document.
     * @param document
     */
    public execute(document: Oas20Document): void {
        console.info("[NewDefinitionCommand] Executing.");
        if (this.isNullOrUndefined(document.definitions)) {
            document.definitions = document.createDefinitions();
            this._nullDefinitions = true;
        }

        if (this.isNullOrUndefined(document.definitions.definition(this._newDefinitionName))) {
            let definition: Oas20SchemaDefinition;
            if (!this.isNullOrUndefined(this._newDefinitionExample)) {
                definition = new OasSchemaFactory().createSchemaDefinitionFromExample(document, this._newDefinitionName, this._newDefinitionExample) as Oas20SchemaDefinition;
                definition.example = this._newDefinitionExample;
            } else {
                definition = document.definitions.createSchemaDefinition(this._newDefinitionName);
                definition.type = "object";
            }
            if (this._newDefinitionDescription) {
                definition.description = this._newDefinitionDescription;
            }
            document.definitions.addDefinition(this._newDefinitionName, definition);

            this._defExisted = false;
        } else {
            this._defExisted = true;
        }
    }

    /**
     * Removes the definition.
     * @param document
     */
    public undo(document: Oas20Document): void {
        console.info("[NewDefinitionCommand] Reverting.");
        if (this._nullDefinitions) {
            document.definitions = null;
        }

        if (this._defExisted) {
            return;
        }
        document.definitions.removeDefinition(this._newDefinitionName);
    }

}


/**
 * OAI 3.0 impl.
 */
export class NewSchemaDefinitionCommand_30 extends NewSchemaDefinitionCommand {

    protected _nullComponents: boolean;

    protected type(): string {
        return "NewSchemaDefinitionCommand_30";
    }

    /**
     * Adds the new definition to the document.
     * @param document
     */
    public execute(document: Oas30Document): void {
        console.info("[NewDefinitionCommand] Executing.");

        if (this.isNullOrUndefined(document.components)) {
            document.components = document.createComponents();
            this._nullComponents = true;
        }
        this._nullComponents = false;

        if (this.isNullOrUndefined(document.components.getSchemaDefinition(this._newDefinitionName))) {
            let definition: Oas30SchemaDefinition;
            if (!this.isNullOrUndefined(this._newDefinitionExample)) {
                definition = new OasSchemaFactory().createSchemaDefinitionFromExample(document, this._newDefinitionName, this._newDefinitionExample) as Oas30SchemaDefinition;
                definition.example = this._newDefinitionExample;
            } else {
                definition = document.components.createSchemaDefinition(this._newDefinitionName);
            }
            if (this._newDefinitionDescription) {
                definition.description = this._newDefinitionDescription;
            }
            document.components.addSchemaDefinition(this._newDefinitionName, definition);

            this._defExisted = false;
        } else {
            this._defExisted = true;
        }
    }

    /**
     * Removes the definition.
     * @param document
     */
    public undo(document: Oas30Document): void {
        console.info("[NewDefinitionCommand] Reverting.");
        if (this._nullComponents) {
            document.components = null;
        }
        if (this._defExisted) {
            return;
        }

        document.components.removeSchemaDefinition(this._newDefinitionName);
    }

}