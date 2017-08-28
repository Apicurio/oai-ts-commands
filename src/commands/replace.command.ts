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
import {Oas20Document, OasDocument, OasNode} from "oai-ts-core";


/**
 * A command used to replace a path item with a newer version.
 *
 * TODO should serialize/deserialize the node instead of just keeping a reference to it (both for the old node and the replacement
 */
export abstract class AbstractReplaceNodeCommand<T extends OasNode> extends AbstractCommand implements ICommand {

    private _newNode: T;
    private _oldNode: T;

    /**
     * C'tor.
     * @param {T} old
     * @param {T} replacement
     */
    constructor(old: T, replacement: T) {
        super();
        this._oldNode = old;
        this._newNode = replacement;
    }

    /**
     * Replaces the node.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[AbstractReplaceNodeCommand] Executing.");

        this.removeNode(document, this._oldNode);
        this.addNode(document, this._newNode);
    }

    /**
     * Switch back!
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[AbstractReplaceNodeCommand] Reverting.");
        let doc: Oas20Document  = <Oas20Document>document;
        if (this.isNullOrUndefined(this._oldNode)) {
            return;
        }

        this._oldNode._parent = this._newNode._parent;
        this._oldNode._ownerDocument = this._newNode._ownerDocument;

        this.removeNode(doc, this._newNode);
        this.addNode(doc, this._oldNode);
    }

    /**
     * Removes the given node from the data model.
     * @param {OasDocument} doc
     * @param {T} node
     */
    protected abstract removeNode(doc: OasDocument, node: T): void;

    /**
     * Adds the given node to the data model.
     * @param {OasDocument} doc
     * @param {T} node
     */
    protected abstract addNode(doc: OasDocument, node: T): void;
}
