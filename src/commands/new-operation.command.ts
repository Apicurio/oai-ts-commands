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
import {OasDocument, OasOperation, OasPathItem} from "oai-ts-core";

/**
 * Factory function.
 */
export function createNewOperationCommand(document: OasDocument, path: string, method: string): NewOperationCommand {
    if (document.getSpecVersion() === "2.0") {
        return new NewOperationCommand_20(path, method);
    } else {
        return new NewOperationCommand_30(path, method);
    }
}

/**
 * A command used to create a new operation in a path.
 */
export abstract class NewOperationCommand extends AbstractCommand implements ICommand {

    private _path: string;
    private _method: string;

    private _created: boolean;

    /**
     * C'tor.
     * @param {string} path
     * @param {string} method
     */
    constructor(path: string, method: string) {
        super();
        this._path = path;
        this._method = method;
    }

    /**
     * Adds the new operation to the path.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[NewOperationCommand] Executing.");

        this._created = false;

        if (this.isNullOrUndefined(document.paths)) {
            return;
        }

        let path: OasPathItem = document.paths.pathItem(this._path) as OasPathItem;
        if (this.isNullOrUndefined(path)) {
            return;
        }

        let operation: OasOperation = path.createOperation(this._method);
        path[this._method] = operation;

        this._created = true;
    }

    /**
     * Removes the path item.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[NewOperationCommand] Reverting.");
        if (!this._created) {
            return;
        }

        if (this.isNullOrUndefined(document.paths)) {
            return;
        }

        let path: OasPathItem = document.paths.pathItem(this._path) as OasPathItem;
        if (this.isNullOrUndefined(path)) {
            return;
        }

        path[this._method] = null;
    }

}


/**
 * OAI 2.0 impl.
 */
export class NewOperationCommand_20 extends NewOperationCommand {

    protected type(): string {
        return "NewOperationCommand_20";
    }

}


/**
 * OAI 3.0 impl.
 */
export class NewOperationCommand_30 extends NewOperationCommand {

    protected type(): string {
        return "NewOperationCommand_30";
    }

}

