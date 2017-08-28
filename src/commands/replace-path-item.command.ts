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
import {Oas20Document, Oas20PathItem, Oas20Paths, Oas30Document, Oas30PathItem, Oas30Paths} from "oai-ts-core";
import {AbstractReplaceNodeCommand} from "./replace.command";


/**
 * A command used to replace a path item with a newer version.
 */
export class ReplacePathItemCommand_20 extends AbstractReplaceNodeCommand<Oas20PathItem> implements ICommand {

    /**
     * Remove the given node.
     * @param doc
     * @param node
     */
    protected removeNode(doc: Oas20Document, node: Oas20PathItem): void {
        let paths: Oas20Paths = <Oas20Paths>node.parent();
        paths.removePathItem(node.path());
    }

    /**
     * Adds the node to the document.
     * @param doc
     * @param node
     */
    protected addNode(doc: Oas20Document, node: Oas20PathItem): void {
        let paths: Oas20Paths = doc.paths as Oas20Paths;
        paths.addPathItem(node.path(), node);
    }

}



/**
 * A command used to replace a path item with a newer version.
 */
export class ReplacePathItemCommand_30 extends AbstractReplaceNodeCommand<Oas30PathItem> implements ICommand {

    /**
     * Remove the given node.
     * @param doc
     * @param node
     */
    protected removeNode(doc: Oas30Document, node: Oas30PathItem): void {
        let paths: Oas30Paths = node.parent() as Oas30Paths;
        paths.removePathItem(node.path());
    }

    /**
     * Adds the node to the document.
     * @param doc
     * @param node
     */
    protected addNode(doc: Oas30Document, node: Oas30PathItem): void {
        let paths: Oas30Paths = doc.paths as Oas30Paths;
        paths.addPathItem(node.path(), node);
    }

}

