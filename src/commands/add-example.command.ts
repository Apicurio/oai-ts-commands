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

import {Oas30Example, Oas30ExampleItems, Oas30MediaType, OasDocument, OasNodePath} from "oai-ts-core";
import {AbstractCommand, ICommand} from "../base";
import {MarshallUtils} from "../util/marshall.util";

/**
 * Factory function.
 */
export function createAddExampleCommand(document: OasDocument, parent: Oas30MediaType, example: any,
                                        exampleName: string, exampleSummary?: string, exampleDescription?: string): AddExampleCommand_30 {
    if (document.getSpecVersion() === "2.0") {
        throw new Error("Named examples were introduced in OpenAPI 3.0.0.");
    } else {
        return new AddExampleCommand_30(parent, example, exampleName, exampleSummary, exampleDescription);
    }
}

/**
 * A command used to add an Example for a 3.0 MediaType.  If an example with the same name
 * already exists, this command does nothing.
 */
export class AddExampleCommand_30 extends AbstractCommand implements ICommand {

    protected _parentPath: OasNodePath;
    protected _newExampleValue: any;
    protected _newExampleName: any;
    protected _newExampleSummary: any;
    protected _newExampleDescription: any;

    protected _exampleAdded: boolean;

    /**
     * Constructor.
     * @param {Oas30MediaType} parent
     * @param example
     * @param {string} exampleName
     * @param {string} exampleSummary
     * @param {string} exampleDescription
     */
    constructor(parent: Oas30MediaType, example: any, exampleName: string, exampleSummary?: string, exampleDescription?: string) {
        super();
        if (parent) {
            this._parentPath = this.oasLibrary().createNodePath(parent);
        }
        this._newExampleValue = example;
        this._newExampleName = exampleName;
        this._newExampleSummary = exampleSummary;
        this._newExampleDescription = exampleDescription;
    }

    protected type(): string {
        return "AddExampleCommand_30";
    }

    /**
     * Executes the command.
     * @param {OasDocument} document
     */
    public execute(document: OasDocument): void {
        console.info("[AddExampleCommand_30] Executing.");
        this._exampleAdded = false;

        let mediaType: Oas30MediaType = this._parentPath.resolve(document) as Oas30MediaType;
        if (this.isNullOrUndefined(mediaType)) {
            return;
        }
        if (this.isNullOrUndefined(mediaType.examples)) {
            mediaType.examples = new Oas30ExampleItems();
        }
        if (!this.isNullOrUndefined(mediaType.examples[this._newExampleName])) {
            return;
        }

        let example: Oas30Example = mediaType.createExample(this._newExampleName);
        example.summary = this._newExampleSummary;
        example.description = this._newExampleDescription;
        example.value = this._newExampleValue;
        mediaType.examples[this._newExampleName] = example;
        this._exampleAdded = true;
    }

    /**
     * Undoes the command.
     * @param {OasDocument} document
     */
    public undo(document: OasDocument): void {
        console.info("[AddExampleCommand_30] Reverting.");
        if (!this._exampleAdded) {
            return;
        }
        let mediaType: Oas30MediaType = this._parentPath.resolve(document) as Oas30MediaType;
        if (this.isNullOrUndefined(mediaType) || this.isNullOrUndefined(mediaType.examples)) {
            return;
        }

        delete mediaType.examples[this._newExampleName];
    }

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._parentPath = MarshallUtils.marshallNodePath(obj._parentPath);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._parentPath = MarshallUtils.unmarshallNodePath(this._parentPath as any);
    }

}
