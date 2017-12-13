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
import {OasDocument, OasNode, OasNodePath} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";


/**
 * A command used to delete a child node.
 */
export abstract class DeleteNodeCommand<T extends OasNode> extends AbstractCommand implements ICommand {

    protected _property: string;
    protected _parentPath: OasNodePath;

    protected _oldValue: any;

    /**
     * C'tor.
     * @param {string} property
     * @param {OasNode} parent
     */
    constructor(property: string, parent: OasNode) {
        super();
        this._property = property;
        if (parent) {
            this._parentPath = this.oasLibrary().createNodePath(parent);
        }
    }

    /**
     * Deletes the property of the node.
     * @param document
     */
    public execute(document: OasDocument): void {
        let parent: OasNode = this._parentPath.resolve(document);
        if (this.isNullOrUndefined(parent)) {
            return;
        }
        let propertyNode: T = parent[this._property] as T;
        if (this.isNullOrUndefined(propertyNode)) {
            this._oldValue = null;
            return;
        } else {
            this._oldValue = this.oasLibrary().writeNode(propertyNode);
        }

        parent[this._property] = null;
        delete parent[this._property];
    }

    /**
     * Restore the old (deleted) child node.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[" + this.type() + "] Reverting.");
        let parent: OasNode = this._parentPath.resolve(document);
        if (this.isNullOrUndefined(parent) || this.isNullOrUndefined(this._oldValue)) {
            return;
        }

        let restoredNode: T = this.readNode(document, this._oldValue);
        restoredNode._parent = parent;
        restoredNode._ownerDocument = parent.ownerDocument();

        parent[this._property] = restoredNode;
    }

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
        obj._parentPath = MarshallUtils.marshallNodePath(obj._parentPath);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._parentPath = MarshallUtils.unmarshallNodePath(this._parentPath as any);
    }

}

