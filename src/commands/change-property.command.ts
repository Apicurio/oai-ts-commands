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
 * A command used to modify the simple property of a node.  Should not be used
 * to modify complex (object) properties, only simple property types like
 * string, boolean, number, etc.
 */
export abstract class AbstractChangePropertyCommand<T> extends AbstractCommand implements ICommand {

    private _nodePath: OasNodePath;
    private _property: string;
    private _newValue: T;

    private _oldValue: T;

    /**
     * C'tor.
     * @param {OasNode} node
     * @param {string} property
     * @param {T} newValue
     */
    constructor(node: OasNode, property: string, newValue: T) {
        super();
        this._nodePath = this.oasLibrary().createNodePath(node);
        this._property = property;
        this._newValue = newValue;
    }

    /**
     * Modifies the property of the node.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangePropertyCommand] Executing.");
        let node: OasNode = this._nodePath.resolve(document);
        if (!node) {
            return;
        }

        this._oldValue = <T>node[this._property];

        node[this._property] = this._newValue;
    }

    /**
     * Resets the property back to a previous state.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangePropertyCommand] Reverting.");
        let node: OasNode = this._nodePath.resolve(document);
        if (!node) {
            return;
        }

        node[this._property] = this._oldValue;
        this._oldValue = null;
    }

}


/**
 * OAI 2.0 impl.
 */
export class ChangePropertyCommand_20<T> extends AbstractChangePropertyCommand<T> {
}


/**
 * OAI 3.0 impl.
 */
export class ChangePropertyCommand_30<T> extends AbstractChangePropertyCommand<T> {
}
