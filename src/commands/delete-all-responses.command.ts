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

import {ICommand} from "../base";
import {Oas20Responses, Oas30Responses, OasDocument, OasOperation, OasResponses} from "oai-ts-core";
import {DeleteNodeCommand} from "./delete-node.command";


/**
 * Factory function.
 */
export function createDeleteAllResponsesCommand(document: OasDocument, operation: OasOperation): DeleteNodeCommand<Oas20Responses> | DeleteNodeCommand<Oas30Responses> {
    if (document.getSpecVersion() === "2.0") {
        return new DeleteAllResponsesCommand_20("responses", operation);
    } else {
        return new DeleteAllResponsesCommand_30("responses", operation);
    }
}


/**
 * A command used to delete an operation.
 */
export abstract class AbstractDeleteAllResponsesCommand<T extends OasResponses> extends DeleteNodeCommand<T> implements ICommand {

    /**
     * Unmarshalls a node into the appropriate type.
     * @param {OasDocument} doc
     * @param node
     * @return {T}
     */
    protected readNode(doc: OasDocument, node: any): T {
        let operation: OasOperation = this._parentPath.resolve(doc) as OasOperation;
        let responses: T = operation.createResponses() as T;
        this.oasLibrary().readNode(node, responses);
        return responses;
    }

}


/**
 * OAI 2.0 impl.
 */
export class DeleteAllResponsesCommand_20 extends AbstractDeleteAllResponsesCommand<Oas20Responses> {

    protected type(): string {
        return "DeleteAllResponsesCommand_20";
    }

}


/**
 * OAI 3.0 impl.
 */
export class DeleteAllResponsesCommand_30 extends AbstractDeleteAllResponsesCommand<Oas30Responses> {

    protected type(): string {
        return "DeleteAllResponsesCommand_30";
    }

}
