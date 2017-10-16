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
import {Oas20Response, Oas30Response, OasDocument, OasNodePath, OasResponse, OasResponses} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";

/**
 * Factory function.
 */
export function createDeleteResponseCommand(document: OasDocument, response: Oas20Response | Oas30Response): DeleteResponseCommand {
    if (document.getSpecVersion() === "2.0") {
        return new DeleteResponseCommand_20(response);
    } else {
        return new DeleteResponseCommand_30(response);
    }
}

/**
 * A command used to delete a single response from an operation.
 */
export abstract class DeleteResponseCommand extends AbstractCommand implements ICommand {

    private _responseCode: string;
    private _responsePath: OasNodePath;
    private _responsesPath: OasNodePath;

    private _oldResponse: any;

    /**
     * C'tor.
     * @param {Oas20Response | Oas30Response} response
     */
    constructor(response: Oas20Response | Oas30Response) {
        super();
        if (response) {
            this._responseCode = response.statusCode();
            this._responsePath = this.oasLibrary().createNodePath(response);
            this._responsesPath = this.oasLibrary().createNodePath(response.parent());
        }
    }

    /**
     * Deletes the response.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteResponseCommand] Executing.");
        this._oldResponse = null;

        let response: OasResponse = this._responsePath.resolve(document) as OasResponse;
        if (this.isNullOrUndefined(response)) {
            return;
        }

        let responses: OasResponses = response.parent() as OasResponses;
        if (this.isNullOrUndefined(this._responseCode)) {
            responses.default = null;
        } else {
            responses.removeResponse(this._responseCode);
        }

        this._oldResponse = this.oasLibrary().writeNode(response);
    }

    /**
     * Restore the old (deleted) parameters.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteResponseCommand] Reverting.");
        if (!this._oldResponse) {
            return;
        }

        let responses: OasResponses = this._responsesPath.resolve(document) as OasResponses;
        if (this.isNullOrUndefined(responses)) {
            return;
        }

        let response: OasResponse = responses.createResponse(this._responseCode);
        this.oasLibrary().readNode(this._oldResponse, response);
        if (this.isNullOrUndefined(this._responseCode)) {
            responses.default = response;
        } else {
            responses.addResponse(this._responseCode, response);
        }
    }

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._responsePath = MarshallUtils.marshallNodePath(obj._responsePath);
        obj._responsesPath = MarshallUtils.marshallNodePath(obj._responsesPath);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._responsePath = MarshallUtils.unmarshallNodePath(this._responsePath as any);
        this._responsesPath = MarshallUtils.unmarshallNodePath(this._responsesPath as any);
    }

}


/**
 * OAI 2.0 impl.
 */
export class DeleteResponseCommand_20 extends DeleteResponseCommand {

    protected type(): string {
        return "DeleteResponseCommand_20";
    }

}


/**
 * OAI 3.0 impl.
 */
export class DeleteResponseCommand_30 extends DeleteResponseCommand {

    protected type(): string {
        return "DeleteResponseCommand_30";
    }

}
