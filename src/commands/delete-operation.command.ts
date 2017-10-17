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
import {Oas20Operation, Oas30Operation, OasDocument, OasOperation, OasPathItem} from "oai-ts-core";
import {DeleteNodeCommand} from "./delete-node.command";


/**
 * Factory function.
 */
export function createDeleteOperationCommand(document: OasDocument, opMethod: string, pathItem: OasPathItem): DeleteNodeCommand<Oas20Operation> | DeleteNodeCommand<Oas30Operation> {
    if (document.getSpecVersion() === "2.0") {
        return new DeleteOperationCommand_20(opMethod, pathItem);
    } else {
        return new DeleteOperationCommand_30(opMethod, pathItem);
    }
}


/**
 * A command used to delete an operation.
 */
export abstract class AbstractDeleteOperationCommand<T extends OasOperation> extends DeleteNodeCommand<T> implements ICommand {

    /**
     * Unmarshalls a node into the appropriate type.
     * @param {OasDocument} doc
     * @param node
     * @return {T}
     */
    protected readNode(doc: OasDocument, node: any): T {
        let pathItem: OasPathItem = this._parentPath.resolve(doc) as OasPathItem;
        let operation: T = pathItem.createOperation(this._property) as T;
        this.oasLibrary().readNode(node, operation);
        return operation;
    }

}


/**
 * OAI 2.0 impl.
 */
export class DeleteOperationCommand_20 extends AbstractDeleteOperationCommand<Oas20Operation> {

    protected type(): string {
        return "DeleteOperationCommand_20";
    }

}


/**
 * OAI 3.0 impl.
 */
export class DeleteOperationCommand_30 extends AbstractDeleteOperationCommand<Oas30Operation> {

    protected type(): string {
        return "DeleteOperationCommand_30";
    }

}
