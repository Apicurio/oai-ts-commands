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
import {OasDocument, OasPathItem} from "oai-ts-core";

/**
 * Factory function.
 */
export function createNewPathCommand(document: OasDocument, newPath: string): NewPathCommand {
    if (document.getSpecVersion() === "2.0") {
        return new NewPathCommand_20(newPath);
    } else {
        return new NewPathCommand_30(newPath);
    }
}

/**
 * A command used to create a new path item in a document.
 */
export abstract class NewPathCommand extends AbstractCommand implements ICommand {

    private _newPath: string;

    private _pathExisted: boolean;
    private _nullPaths: boolean;

    /**
     * C'tor.
     * @param {string} newPath
     */
    constructor(newPath: string) {
        super();
        this._newPath = newPath;
    }

    /**
     * Adds the new path to the document.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[NewPathCommand] Executing.");
        if (this.isNullOrUndefined(document.paths)) {
            document.paths = document.createPaths();
            this._nullPaths = true;
        }

        if (this.isNullOrUndefined(document.paths.pathItem(this._newPath))) {
            let pathItem: OasPathItem = document.paths.createPathItem(this._newPath) as OasPathItem;
            document.paths.addPathItem(this._newPath, pathItem);
            this._pathExisted = false;
        } else {
            this._pathExisted = true;
        }

    }

    /**
     * Removes the path item.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[NewPathCommand] Reverting.");
        if (this._pathExisted) {
            console.info("[NewPathCommand] path already existed, nothing done so no rollback necessary.");
            return;
        }
        if (this._nullPaths) {
            console.info("[NewPathCommand] Paths was null, deleting it.");
            document.paths = null;
        } else {
            console.info("[NewPathCommand] Removing a path item: %s", this._newPath);
            document.paths.removePathItem(this._newPath);
        }
    }

}


/**
 * OAI 2.0 impl.
 */
export class NewPathCommand_20 extends NewPathCommand {

}


/**
 * OAI 3.0 impl.
 */
export class NewPathCommand_30 extends NewPathCommand {

}