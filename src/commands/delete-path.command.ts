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
import {OasDocument, OasPathItem, OasPaths} from "oai-ts-core";


/**
 * A command used to delete a path.
 */
export abstract class AbstractDeletePathCommand extends AbstractCommand implements ICommand {

    private _path: string;

    private _oldPath: any;

    /**
     * C'tor.
     * @param {string} path
     */
    constructor(path: string) {
        super();
        this._path = path;
    }

    /**
     * Deletes the path.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeletePathCommand] Executing for path: %s", this._path);
        this._oldPath = null;
        let paths: OasPaths = document.paths;
        if (this.isNullOrUndefined(paths)) {
            return;
        }

        this._oldPath = this.oasLibrary().writeNode(paths.removePathItem(this._path));
    }

    /**
     * Restore the old (deleted) path.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeletePathCommand] Reverting.");
        let paths: OasPaths = document.paths;
        if (this.isNullOrUndefined(paths) || this.isNullOrUndefined(this._oldPath)) {
            return;
        }

        let pathItem: OasPathItem = paths.createPathItem(this._path);
        this.oasLibrary().readNode(this._oldPath, pathItem);
        paths.addPathItem(this._path, pathItem);
    }

}


/**
 * OAI 2.0 impl.
 */
export class DeletePathCommand_20 extends AbstractDeletePathCommand {

}


/**
 * OAI 3.0 impl.
 */
export class DeletePathCommand_30 extends AbstractDeletePathCommand {

}
