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
import {ModelUtils} from "../util/model.util";

/**
 * Factory function.
 */
export function createRenamePathItemCommand(document: OasDocument, oldPath: string, newPath: string,
                                            alsoRenameSubpaths: boolean = true): RenamePathItemCommand {
    return new RenamePathItemCommand(oldPath, newPath, alsoRenameSubpaths);
}

/**
 * A command used to rename a path item, along with all references to it.
 */
export class RenamePathItemCommand extends AbstractCommand implements ICommand {

    private _oldPath: string;
    private _newPath: string;
    private _alsoRenameSubpaths: boolean;

    /**
     * C'tor.
     * @param oldPath
     * @param newPath
     * @param alsoRenameSubpaths
     */
    constructor(oldPath: string, newPath: any, alsoRenameSubpaths: boolean = false) {
        super();
        this._oldPath = oldPath;
        this._newPath = newPath;
        this._alsoRenameSubpaths = alsoRenameSubpaths;
    }

    protected type(): string {
        return "RenamePathItemCommand";
    }

    /**
     * Adds the new pathItem to the document.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[RenamePathItemCommand] Executing.");
        this._doPathRename(document, this._oldPath, this._newPath, this._alsoRenameSubpaths);
    }

    /**
     * Removes the pathItem.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[RenamePathItemCommand] Reverting.");
        this._doPathRename(document, this._newPath, this._oldPath, this._alsoRenameSubpaths);
    }

    /**
     * Does the work of renaming a path from one name to another.
     * @param document
     * @param from
     * @param to
     * @param alsoRenameSubpaths
     */
    private _doPathRename(document: OasDocument, from: string, to: string, alsoRenameSubpaths: boolean): void {
        let pathsToRename: any[] = [];
        pathsToRename.push({
            from: from,
            to: to
        });
        if (this._alsoRenameSubpaths && document.paths) {
            document.paths.pathItemNames().forEach( pathName => {
                if (pathName.indexOf(from) === 0 && pathName !== from) {
                    pathsToRename.push({
                        from: pathName,
                        to: to + pathName.substring(from.length)
                    });
                }
            });
        }

        pathsToRename.forEach( p2r => {
            this._renamePath(document, p2r.from, p2r.to);
        });
    }

    /**
     * Does the work of renaming a path.
     * @param from
     * @param to
     */
    private _renamePath(document: OasDocument, from: string, to: string): void {
        let fromPathParamNames: string[] = ModelUtils.detectPathParamNames(from);
        let toPathParamNames: string[] = ModelUtils.detectPathParamNames(to);
        if (fromPathParamNames.length !== toPathParamNames.length) {
            // TODO uh oh - what to do here?
        }
        // First, rename the path itself
        let path: OasPathItem = document.paths.removePathItem(from);
        path["_path"] = to;
        document.paths.addPathItem(to, path);

        // Next, rename all of the path params (if necessary)
        fromPathParamNames.forEach( (fromParamName, idx) => {
            let toParamName: string = toPathParamNames[idx];
            if (toParamName) {
                this._renamePathParameter(path, fromParamName, toParamName);
            } else {
                this._removePathParameter(path, fromParamName);
            }
        });
    }

    /**
     * Rename a path parameter.
     * @param path
     * @param fromParamName
     * @param toParamName
     */
    private _renamePathParameter(path: OasPathItem, fromParamName: string, toParamName: string) {
        if (fromParamName !== toParamName && path.parameters) {
            path.parameters.forEach( param => {
                if (param.in === "path" && param.name === fromParamName) {
                    param.name = toParamName;
                }
            });
        }
    }

    /**
     * Remove a path parameter.
     * @param path
     * @param fromParamName
     */
    private _removePathParameter(path: OasPathItem, fromParamName: string) {
        if (!path.parameters) {
            return;
        }
        let paramIdx: number = -1;
        path.parameters.forEach( (param, idx) => {
            if (param.name === fromParamName && param.in === "path") {
                paramIdx = idx;
            }
        });
        // TODO save the parameter that was deleted so it can be restored on undo()
        // TODO ALT: or perhaps save the whole path to be easily restored?
        if (paramIdx !== -1) {
            path.parameters.splice(paramIdx, 1);
        }
    }
}
