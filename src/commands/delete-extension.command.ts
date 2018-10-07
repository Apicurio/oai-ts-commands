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

import {AbstractCommand, ICommand} from "../base";
import {OasDocument, OasExtensibleNode, OasExtension, OasNodePath} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";

/**
 * Factory function.
 */
export function createDeleteExtensionCommand(document: OasDocument, extension: OasExtension): DeleteExtensionCommand {
    return new DeleteExtensionCommand(extension);
}


/**
 * A command used to delete a single mediaType from an operation.
 */
export class DeleteExtensionCommand extends AbstractCommand implements ICommand {

    protected _parentPath: OasNodePath;
    protected _name: string;

    protected _hasOldValue: boolean;
    protected _oldValue: any;

    /**
     * C'tor.
     * @param extension
     */
    constructor(extension: OasExtension) {
        super();
        if (!this.isNullOrUndefined(extension)) {
            this._parentPath = this.oasLibrary().createNodePath(extension.parent());
            this._name = extension.name;
        }
    }

    protected type(): string {
        return "DeleteExtensionCommand";
    }

    public execute(document: OasDocument): void {
        console.info("[DeleteExtensionCommand] Executing.");
        this._oldValue = null;
        this._hasOldValue = false;

        let parent: OasExtensibleNode = this._parentPath.resolve(document) as OasExtensibleNode;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        // Find any existing extension with this name
        let extension: OasExtension = parent.extension(this._name);

        // If found, remove it.
        if (extension) {
            this._hasOldValue = true;
            this._oldValue = extension.value;

            parent.removeExtension(this._name);
        } else {
            this._hasOldValue = false;
        }
    }

    public undo(document: OasDocument): void {
        console.info("[DeleteExtensionCommand] Reverting.");

        let parent: OasExtensibleNode = this._parentPath.resolve(document) as OasExtensibleNode;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        // Find any existing extension with this name
        let extension: OasExtension = parent.extension(this._name);

        if (this._hasOldValue && extension) {
            extension.value = this._oldValue;
        }

        if (this._hasOldValue && !extension) {
            parent.addExtension(this._name, this._oldValue);
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

