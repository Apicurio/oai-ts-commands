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
import {Oas20Document, OasDocument, OasNode, OasNodePath} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";


/**
 * A command used to replace a path item with a newer version.
 */
export abstract class ReplaceNodeCommand<T extends OasNode> extends AbstractCommand implements ICommand {

    private _nodePath: OasNodePath;
    private _new: any;

    private _old: any;

    /**
     * C'tor.
     * @param {T} old
     * @param {T} replacement
     */
    constructor(old: T, replacement: T) {
        super();
        if (old) {
            this._nodePath = this.oasLibrary().createNodePath(old);
        }
        if (replacement) {
            this._new = this.oasLibrary().writeNode(replacement);
        }
    }

    /**
     * Replaces the node.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[AbstractReplaceNodeCommand] Executing.");
        this._old = null;

        let oldNode: T = this._nodePath.resolve(document) as T;
        if (this.isNullOrUndefined(oldNode)) {
            return;
        }

        this._old = this.oasLibrary().writeNode(oldNode);
        this.removeNode(document, oldNode);

        let newNode: T = this.readNode(document, this._new);
        this.addNode(document, newNode);
    }

    /**
     * Switch back!
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[AbstractReplaceNodeCommand] Reverting.");
        let doc: Oas20Document  = document as Oas20Document;
        if (this.isNullOrUndefined(this._old)) {
            return;
        }

        let node: T = this._nodePath.resolve(document) as T;
        if (this.isNullOrUndefined(node)) {
            return;
        }

        this.removeNode(doc, node);

        let restoreNode: T = this.readNode(document, this._old);
        this.addNode(document, restoreNode);
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

    /**
     * Unmarshalls a node into the appropriate type.
     * @param node
     * @return {T}
     */
    protected abstract readNode(doc: OasDocument, node: any): T;

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._nodePath = MarshallUtils.marshallNodePath(obj._nodePath);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._nodePath = MarshallUtils.unmarshallNodePath(this._nodePath as any);
    }

}
