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
import {Oas30Operation, Oas30RequestBody, OasDocument} from "oai-ts-core";
import {DeleteNodeCommand} from "./delete-node.command";


/**
 * Factory function.
 */
export function createDeleteRequestBodyCommand(document: OasDocument, operation: Oas30Operation): DeleteNodeCommand<Oas30RequestBody> {
    if (document.getSpecVersion() === "2.0") {
        throw new Error("Request Body was introduced in OpenAPI 3.0.0.");
    } else {
        return new DeleteRequestBodyCommand_30("requestBody", operation);
    }
}


/**
 * A command used to delete an operation.
 */
export class DeleteRequestBodyCommand_30 extends DeleteNodeCommand<Oas30RequestBody> implements ICommand {

    protected type(): string {
        return "DeleteRequestBodyCommand_30";
    }

    /**
     * Unmarshalls a node into the appropriate type.
     * @param {OasDocument} doc
     * @param node
     * @return {Oas30RequestBody}
     */
    protected readNode(doc: OasDocument, node: any): Oas30RequestBody {
        let operation: Oas30Operation = this._parentPath.resolve(doc) as Oas30Operation;
        let requestBody: Oas30RequestBody = operation.createRequestBody();
        this.oasLibrary().readNode(node, requestBody);
        return requestBody;
    }

}
