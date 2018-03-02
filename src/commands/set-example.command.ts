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

import {Oas20Document, Oas20Response, Oas30Document, Oas30MediaType, OasDocument, OasNodePath} from "oai-ts-core";
import {AbstractCommand, ICommand} from "../base";
import {MarshallUtils} from "../util/marshall.util";

/**
 * Factory function.
 */
export function createSetExampleCommand(document: OasDocument, parent: Oas30MediaType | Oas20Response, example: any,
                                        contentType?: string): SetExampleCommand {
    if (document.getSpecVersion() === "2.0") {
        return new SetExampleCommand_20(parent as Oas20Response, example, contentType);
    } else {
        return new SetExampleCommand_30(parent, example);
    }
}

/**
 * A command used to set the Example for a 3.0 MediaType or a 2.0 Response.
 */
export abstract class SetExampleCommand extends AbstractCommand implements ICommand {

    protected _parentPath: OasNodePath;
    protected _newExample: any;
    
    protected _oldValue: any;

    /**
     * Constructor.
     * @param {Oas30MediaType | Oas20Response} parent
     * @param example
     */
    constructor(parent: Oas30MediaType | Oas20Response, example: any) {
        super();
        if (parent) {
            this._parentPath = this.oasLibrary().createNodePath(parent);
        }
        this._newExample = example;
    }

    public abstract execute(document: OasDocument): void;
    public abstract undo(document: OasDocument): void;

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


export class SetExampleCommand_20 extends SetExampleCommand {

    private _newContentType: string;

    private _nullExamples: boolean = false;

    /**
     * C'tor.
     * @param {Oas20Response} parent
     * @param example
     * @param {string} contentType
     */
    constructor(parent: Oas20Response, example: any, contentType: string) {
        super(parent, example);
        this._newContentType = contentType;
    }

    protected type(): string {
        return "SetExampleCommand_20";
    }

    /**
     * Sets the example on the response object.
     * @param document
     */
    public execute(document: Oas20Document): void {
        console.info("[SetExampleCommand_20] Executing.");
        this._oldValue = null;

        let response: Oas20Response = this._parentPath.resolve(document) as Oas20Response;
        if (this.isNullOrUndefined(response)) {
            return;
        }

        if (!response.examples) {
            response.examples = response.createExample();
            this._nullExamples = true;
        }

        this._oldValue = response.examples.example(this._newContentType);
        response.examples.addExample(this._newContentType, this._newExample);
    }

    /**
     * Reverts the example to the previous value.
     * @param {OasDocument} document
     */
    public undo(document: OasDocument): void {
        console.info("[SetExampleCommand_20] Reverting.");

        let response: Oas20Response = this._parentPath.resolve(document) as Oas20Response;
        if (this.isNullOrUndefined(response)) {
            return;
        }

        if (!response.examples) {
            return;
        }

        if (this._nullExamples) {
            response.examples = null;
            return;
        }

        if (this.isNullOrUndefined(this._oldValue)) {
            response.examples.removeExample(this._newContentType);
        } else {
            response.examples.addExample(this._newContentType, this._oldValue);
        }
    }

}


export class SetExampleCommand_30 extends SetExampleCommand {

    protected type(): string {
        return "SetExampleCommand_30";
    }

    /**
     * Sets the example on the MediaType object.
     * @param document
     */
    public execute(document: Oas30Document): void {
        console.info("[SetExampleCommand_30] Executing.");
        this._oldValue = null;

        let mediaType: Oas30MediaType = this._parentPath.resolve(document) as Oas30MediaType;
        if (this.isNullOrUndefined(mediaType)) {
            return;
        }

        this._oldValue = mediaType.example;
        mediaType.example = this._newExample;
    }

    /**
     * Reverts the example to the previous value.
     * @param {OasDocument} document
     */
    public undo(document: OasDocument): void {
        console.info("[SetExampleCommand_30] Reverting.");
        let mediaType: Oas30MediaType = this._parentPath.resolve(document) as Oas30MediaType;
        if (this.isNullOrUndefined(mediaType)) {
            return;
        }

        mediaType.example = this._oldValue;
        this._oldValue = null;
    }

}