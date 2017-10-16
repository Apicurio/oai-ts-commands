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
export function createAddPathItemCommand(document: OasDocument, pathItemName: string, obj: any): AddPathItemCommand {
    if (document.getSpecVersion() === "2.0") {
        return new AddPathItemCommand_20(pathItemName, obj);
    } else {
        return new AddPathItemCommand_30(pathItemName, obj);
    }
}

/**
 * A command used to add a new pathItem in a document.  Source for the new
 * pathItem must be provided.  This source will be converted to an OAS
 * pathItem object and then added to the data model.
 */
export abstract class AddPathItemCommand extends AbstractCommand implements ICommand {

    private _pathItemExits: boolean;
    private _newPathItemName: string;
    private _newPathItemObj: any;
    private _nullPathItems: boolean;

    /**
     * C'tor.
     * @param {string} pathItemName
     * @param obj
     */
    constructor(pathItemName: string, obj: any) {
        super();
        this._newPathItemName = pathItemName;
        this._newPathItemObj = obj;
    }

    /**
     * Adds the new pathItem to the document.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[AddPathItemCommand] Executing.");
        if (this.isNullOrUndefined(document.paths)) {
            document.paths = document.createPaths();
            this._nullPathItems = true;
        }

        if (document.paths.pathItem(this._newPathItemName)) {
            console.info("[AddPathItemCommand] PathItem with name %s already exists.", this._newPathItemName);
            this._pathItemExits = true;
        } else {
            let pathItem: OasPathItem = document.paths.createPathItem(this._newPathItemName);
            pathItem = this.oasLibrary().readNode(this._newPathItemObj, pathItem) as OasPathItem;
            document.paths.addPathItem(this._newPathItemName, pathItem);
            this._pathItemExits = false;
        }
    }

    /**
     * Removes the pathItem.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[AddPathItemCommand] Reverting.");
        if (this._pathItemExits) {
            return;
        }
        if (this._nullPathItems) {
            document.paths = null;
        } else {
            document.paths.removePathItem(this._newPathItemName);
        }
    }
}

/**
 * The OAI 2.0 impl.
 */
export class AddPathItemCommand_20 extends AddPathItemCommand {

    protected type(): string {
        return "AddPathItemCommand_20";
    }

}


/**
 * The OAI 3.0 impl.
 */
export class AddPathItemCommand_30 extends AddPathItemCommand {

    protected type(): string {
        return "AddPathItemCommand_30";
    }

}
