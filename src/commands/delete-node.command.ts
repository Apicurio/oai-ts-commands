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

/**
 * Factory function.
 */
export function createDeleteNodeCommand(document: OasDocument, property: string, parent: OasNode): DeleteNodeCommand {
    if (document.getSpecVersion() === "2.0") {
        return new DeleteNodeCommand_20(property, parent);
    } else {
        return new DeleteNodeCommand_30(property, parent);
    }
}

/**
 * A command used to delete a child node.
 */
export abstract class DeleteNodeCommand extends AbstractCommand implements ICommand {

    private _property: string;
    private _parentPath: OasNodePath;

    // TODO this is not serializable - need to come up with a better way to undo() this operation
    private _oldValue: OasNode;

    /**
     * C'tor.
     * @param {string} property
     * @param {OasNode} parent
     */
    constructor(property: string, parent: OasNode) {
        super();
        this._property = property;
        this._parentPath = this.oasLibrary().createNodePath(parent);
    }

    /**
     * Deletes the property of the node.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteNodeCommand] Executing.");
        let parent: OasNode = this._parentPath.resolve(document);
        if (!parent) {
            return;
        }

        this._oldValue = parent[this._property] as OasNode;

        parent[this._property] = null;
        delete parent[this._property];
    }

    /**
     * Restore the old (deleted) child node.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteNodeCommand] Reverting.");
        let parent: OasNode = this._parentPath.resolve(document);
        if (!parent) {
            return;
        }

        parent[this._property] = this._oldValue;
        this._oldValue._parent = parent;
        this._oldValue._ownerDocument = parent.ownerDocument();
    }

}


/**
 * OAI 2.0 impl.
 */
export class DeleteNodeCommand_20 extends DeleteNodeCommand {

}


/**
 * OAI 3.0 impl.
 */
export class DeleteNodeCommand_30 extends DeleteNodeCommand {

}

