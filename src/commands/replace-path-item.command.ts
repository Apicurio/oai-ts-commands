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
import {Oas20PathItem, Oas30PathItem, OasDocument, OasPathItem} from "oai-ts-core";
import {ReplaceNodeCommand} from "./replace.command";


/**
 * Factory function.
 */
export function createReplacePathItemCommand(document: OasDocument, old: Oas20PathItem | Oas30PathItem,
                                             replacement: Oas20PathItem | Oas30PathItem): ReplaceNodeCommand<Oas20PathItem> | ReplaceNodeCommand<Oas30PathItem> {
    if (document.getSpecVersion() === "2.0") {
        return new ReplacePathItemCommand_20(old as Oas20PathItem, replacement as Oas20PathItem);
    } else {
        return new ReplacePathItemCommand_30(old as Oas30PathItem, replacement as Oas30PathItem);
    }
}


/**
 * A command used to replace a path item with a newer version.
 */
export abstract class AbstractReplacePathItemCommand<T extends OasPathItem> extends ReplaceNodeCommand<T> implements ICommand {

    private _pathName: string;

    /**
     * @param {OasPathItem} old
     * @param {OasPathItem} replacement
     */
    constructor(old: T, replacement: T) {
        super(old, replacement);
        if (old) {
            this._pathName = old.path();
        }
    }

    /**
     * Remove the given node.
     * @param doc
     * @param node
     */
    protected removeNode(doc: OasDocument, node: T): void {
        doc.paths.removePathItem(node.path());
    }

    /**
     * Adds the node to the document.
     * @param doc
     * @param node
     */
    protected addNode(doc: OasDocument, node: T): void {
        node._ownerDocument = doc;
        node._parent = doc.paths;
        doc.paths.addPathItem(this._pathName, node);
    }

    /**
     * Reads a node into the appropriate model.
     * @param {OasDocument} doc
     * @param node
     * @return {T}
     */
    protected readNode(doc: OasDocument, node: any): T {
        let pathItem: T = doc.paths.createPathItem(this._pathName) as T;
        this.oasLibrary().readNode(node, pathItem);
        return pathItem;
    }

}


/**
 * A command used to replace a path item with a newer version.
 */
export class ReplacePathItemCommand_20 extends AbstractReplacePathItemCommand<Oas20PathItem> implements ICommand {

    /**
     * @return {string}
     */
    protected type(): string {
        return "ReplacePathItemCommand_20";
    }

}



/**
 * A command used to replace a path item with a newer version.
 */
export class ReplacePathItemCommand_30 extends AbstractReplacePathItemCommand<Oas30PathItem> implements ICommand {

    /**
     * @return {string}
     */
    protected type(): string {
        return "ReplacePathItemCommand_30";
    }

}

