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
import {ReplaceNodeCommand} from "./replace.command";

/**
 * Factory function.
 */
export function createReplaceOperationCommand(document: OasDocument,
                                              old: Oas20Operation | Oas30Operation,
                                              replacement: Oas20Operation | Oas30Operation): ReplaceNodeCommand<Oas20Operation> | ReplaceNodeCommand<Oas30Operation> {
    if (document.getSpecVersion() === "2.0") {
        return new ReplaceOperationCommand_20(old as Oas20Operation, replacement as Oas20Operation);
    } else {
        return new ReplaceOperationCommand_30(old as Oas30Operation, replacement as Oas30Operation);
    }
}


/**
 * A command used to replace an operation with a newer version.
 */
export abstract class AbstractReplaceOperationCommand<T extends OasOperation> extends ReplaceNodeCommand<T> implements ICommand {

    private _method: string;
    private _path: string;

    /**
     * @param {T} old
     * @param {T} replacement
     */
    constructor(old: T, replacement: T) {
        super(old, replacement);
        if (old) {
            this._method = old.method();
            this._path = (<OasPathItem>old.parent()).path();
        }
    }

    /**
     * Remove the given node.
     * @param {OasDocument} doc
     * @param {T} node
     */
    protected removeNode(doc: OasDocument, node: T): void {
        let path: OasPathItem = doc.paths.pathItem(this._path);
        path[node.method()] = null;
    }

    /**
     * Adds the node to the document.
     * @param {OasDocument} doc
     * @param {T} node
     */
    protected addNode(doc: OasDocument, node: T): void {
        let path: OasPathItem = doc.paths.pathItem(this._path) as OasPathItem;
        node._parent = path;
        node._ownerDocument = path.ownerDocument();
        path[node.method()] = node;
    }

    /**
     * Reads a node into the appropriate model.
     * @param {OasDocument} doc
     * @param node
     * @return {T}
     */
    protected readNode(doc: OasDocument, node: any): T {
        let parent: OasPathItem = doc.paths.pathItem(this._path);
        let operation: T = parent.createOperation(this._method) as T;
        this.oasLibrary().readNode(node, operation);
        return operation;
    }

}


/**
 * A command used to replace an operation with a newer version.
 */
export class ReplaceOperationCommand_20 extends AbstractReplaceOperationCommand<Oas20Operation> implements ICommand {

    /**
     * @return {string}
     */
    protected type(): string {
        return "ReplaceOperationCommand_20";
    }

}


/**
 * A command used to replace an operation with a newer version.
 */
export class ReplaceOperationCommand_30 extends AbstractReplaceOperationCommand<Oas30Operation> implements ICommand {

    /**
     * @return {string}
     */
    protected type(): string {
        return "ReplaceOperationCommand_30";
    }

}
