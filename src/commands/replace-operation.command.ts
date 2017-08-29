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
import {
    Oas20Document,
    Oas20Operation,
    Oas20PathItem,
    Oas30Document,
    Oas30Operation,
    Oas30PathItem,
    OasDocument
} from "oai-ts-core";
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
export class ReplaceOperationCommand_20 extends ReplaceNodeCommand<Oas20Operation> implements ICommand {

    /**
     * Remove the given node.
     * @param doc
     * @param node
     */
    protected removeNode(doc: Oas20Document, node: Oas20Operation): void {
        let path: Oas20PathItem = node.parent() as Oas20PathItem;
        path[node.method()] = null;
    }

    /**
     * Adds the node to the document.
     * @param doc
     * @param node
     */
    protected addNode(doc: Oas20Document, node: Oas20Operation): void {
        let path: Oas20PathItem = node.parent() as Oas20PathItem;
        path[node.method()] = node;
    }

}


/**
 * A command used to replace an operation with a newer version.
 */
export class ReplaceOperationCommand_30 extends ReplaceNodeCommand<Oas30Operation> implements ICommand {

    /**
     * Remove the given node.
     * @param doc
     * @param node
     */
    protected removeNode(doc: Oas30Document, node: Oas30Operation): void {
        let path: Oas30PathItem = node.parent() as Oas30PathItem;
        path[node.method()] = null;
    }

    /**
     * Adds the node to the document.
     * @param doc
     * @param node
     */
    protected addNode(doc: Oas30Document, node: Oas30Operation): void {
        let path: Oas30PathItem = node.parent() as Oas30PathItem;
        path[node.method()] = node;
    }

}
