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
 * Factory function.
 */
export function createChangePropertyCommand<T>(document: OasDocument, node: OasNode, property: string, newValue: T): ChangePropertyCommand<T> {
    if (document.getSpecVersion() === "2.0") {
        return new ChangePropertyCommand_20<T>(node, property, newValue);
    } else {
        return new ChangePropertyCommand_30<T>(node, property, newValue);
    }
}

/**
 * A command used to modify the simple property of a node.  Should not be used
 * to modify complex (object) properties, only simple property types like
 * string, boolean, number, etc.
 */
export abstract class ChangePropertyCommand<T> extends AbstractCommand implements ICommand {

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
        if (node) {
            this._nodePath = this.oasLibrary().createNodePath(node);
        }
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
        if (this.isNullOrUndefined(node)) {
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
        if (this.isNullOrUndefined(node)) {
            return;
        }

        node[this._property] = this._oldValue;
        this._oldValue = null;
    }

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


/**
 * OAI 2.0 impl.
 */
export class ChangePropertyCommand_20<T> extends ChangePropertyCommand<T> {

    protected type(): string {
        return "ChangePropertyCommand_20";
    }

}


/**
 * OAI 3.0 impl.
 */
export class ChangePropertyCommand_30<T> extends ChangePropertyCommand<T> {

    protected type(): string {
        return "ChangePropertyCommand_30";
    }

}
