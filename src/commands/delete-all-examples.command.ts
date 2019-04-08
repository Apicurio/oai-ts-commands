/**
 * @license
 * Copyright 2018 JBoss Inc
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
import {Oas20Response, Oas30Example, Oas30MediaType, OasDocument, OasNodePath, Oas30ExampleItems} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";

/**
 * Factory function.
 */
export function createDeleteAllExamplesCommand(document: OasDocument, mediaType: Oas30MediaType): DeleteAllExamplesCommand_30 {
    if (document.getSpecVersion() === "2.0") {
        throw new Error("Not supported in OpenAPI 2.0.");
    } else {
        return new DeleteAllExamplesCommand_30(mediaType);
    }
}

/**
 * A command used to delete a single mediaType from an operation.
 */
export class DeleteAllExamplesCommand_30 extends AbstractCommand implements ICommand {

    private _mediaTypePath: OasNodePath;

    private _oldExamples: {[key: string]: any} = {};

    /**
     * C'tor.
     * @param
     */
    constructor(mediaType: Oas30MediaType) {
        super();
        // We must allow for null in the constructor when unmarshalling the command.
        if (!this.isNullOrUndefined(mediaType)) {
            this._mediaTypePath = this.oasLibrary().createNodePath(mediaType);
        }
    }

    protected type(): string {
        return "DeleteAllExamplesCommand_30";
    }

    /**
     * Deletes all examples from the media type.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteAllExamplesCommand] Executing.");

        if (this.isNullOrUndefined(document)) {
            console.debug("[DeleteAllExamplesCommand] Could not execute the command, invalid argument.");
            return;
        }

        if (this.isNullOrUndefined(this._mediaTypePath)) {
            console.debug("[DeleteAllExamplesCommand] Could not execute the command, problem when unmarshalling.");
            return;
        }

        let mediaType: Oas30MediaType = this._mediaTypePath.resolve(document) as Oas30MediaType;

        if (this.isNullOrUndefined(mediaType)) {
            console.debug("[DeleteAllExamplesCommand] Media type not found.");
            return;
        }

        mediaType.getExamples().forEach(e => {
            this._oldExamples[e.name()] = this.oasLibrary().writeNode(e);
        });
        mediaType.examples = null;
    }

    /**
     * Restore the old (deleted) examples.
     * @param document
     */
    public undo(document: OasDocument): void {

        if (this.isNullOrUndefined(document)) {
            console.debug("[DeleteAllExamplesCommand] Could not revert the command, invalid argument.");
            return;
        }

        if (this.isNullOrUndefined(this._mediaTypePath)) {
            console.debug("[DeleteAllExamplesCommand] Could not revert the command, problem when unmarshalling.");
            return;
        }

        console.info("[DeleteAllExamplesCommand] Reverting.");

        let mediaType: Oas30MediaType = this._mediaTypePath.resolve(document) as any;
        if (this.isNullOrUndefined(mediaType)) {
            console.info("[DeleteAllExamplesCommand] No media type found.");
            return;
        }

        if (this.isNullOrUndefined(this._oldExamples)) {
            console.log("[DeleteAllExamplesCommand] Could not revert. Previous data is not available.");
            return;
        }

        for(let k in this._oldExamples) {
            let example: Oas30Example = mediaType.createExample(k);
            this.oasLibrary().readNode(this._oldExamples[k], example);
            mediaType.addExample(example);
        }
    }

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._mediaTypePath = MarshallUtils.marshallNodePath(obj._mediaTypePath);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._mediaTypePath = MarshallUtils.unmarshallNodePath(this._mediaTypePath as any);
    }

}
