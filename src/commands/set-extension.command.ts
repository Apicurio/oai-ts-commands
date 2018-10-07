/**
 * @license
 * Copyright 2018 JBoss Inc
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

import {OasDocument, OasExtensibleNode, OasExtension, OasNodePath} from "oai-ts-core";
import {AbstractCommand, ICommand} from "../base";
import {MarshallUtils} from "../util/marshall.util";

/**
 * Factory function.
 */
export function createSetExtensionCommand(document: OasDocument, parent: OasExtensibleNode, name: string, value: any): SetExtensionCommand {
    return new SetExtensionCommand(parent, name, value);
}

/**
 * A command used to set the Extension for a 3.0 MediaType or a 2.0 Response.
 */
export class SetExtensionCommand extends AbstractCommand implements ICommand {

    protected _parentPath: OasNodePath;
    protected _name: string;
    protected _value: any;

    protected _hasOldValue: boolean;
    protected _oldValue: any;

    /**
     * Constructor.
     */
    constructor(parent: OasExtensibleNode, name: string, value: any) {
        super();
        if (parent) {
            this._parentPath = this.oasLibrary().createNodePath(parent);
        }
        this._name = name;
        this._value = value;
    }

    protected type(): string {
        return "SetExtensionCommand";
    }

    public execute(document: OasDocument): void {
        console.info("[SetExtensionCommand] Executing.");
        this._oldValue = null;
        this._hasOldValue = false;

        let parent: OasExtensibleNode = this._parentPath.resolve(document) as OasExtensibleNode;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        // Find any existing extension with this name
        let extension: OasExtension = parent.extension(this._name);

        // Either update the existing extension or add a new one
        if (extension) {
            this._hasOldValue = true;
            this._oldValue = extension.value;

            extension.value = this._value;
        } else {
            this._hasOldValue = false;
            this._oldValue = null;

            parent.addExtension(this._name, this._value);
        }
    }

    public undo(document: OasDocument): void {
        console.info("[SetExtensionCommand] Reverting.");

        let parent: OasExtensibleNode = this._parentPath.resolve(document) as OasExtensibleNode;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        // Find any existing extension with this name
        let extension: OasExtension = parent.extension(this._name);

        if (this._hasOldValue && extension) {
            extension.value = this._oldValue;
        }

        if (!this._hasOldValue && extension) {
            parent.removeExtension(this._name);
        }
    }

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
