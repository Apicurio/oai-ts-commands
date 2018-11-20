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
import {
    Oas20PathItem,
    Oas30Document,
    Oas30Operation,
    Oas30PathItem,
    OasDocument,
    OasNodePath,
    OasOperation
} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";
import {Oas30Server} from "oai-ts-core/src/models/3.0/server.model";

/**
 * Factory function.
 */
export function createDeleteAllOperationsCommand(parent: Oas30PathItem | Oas20PathItem): DeleteAllOperationsCommand {
    return new DeleteAllOperationsCommand(parent);
}

/**
 * A command used to delete all servers from a document.
 */
export class DeleteAllOperationsCommand extends AbstractCommand implements ICommand {

    protected _parentPath: OasNodePath;
    private _oldOperations: any[];

    /**
     * C'tor.
     */
    constructor(parent: Oas30PathItem | Oas20PathItem) {
        super();
        if (parent) {
            this._parentPath = this.oasLibrary().createNodePath(parent);
        }
    }

    protected type(): string {
        return "DeleteAllOperationsCommand";
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

    /**
     * Deletes the servers.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteAllOperationsCommand] Executing.");
        this._oldOperations = [];

        let parent: Oas30PathItem | Oas20PathItem = this._parentPath.resolve(document) as any;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        // Save the old operations (if any)
        let allMethods: string[] = [ "get", "put", "post", "delete", "head", "patch", "options", "trace" ];
        allMethods.forEach( method => {
            let oldOp: OasOperation = parent[method];
            if (!this.isNullOrUndefined(oldOp)) {
                let oldOpData: any = {
                    "_method": method,
                    "_operation": this.oasLibrary().writeNode(oldOp)
                };
                this._oldOperations.push(oldOpData);
                delete parent[method];
            }
        });
    }

    /**
     * Restore the old (deleted) property.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteAllOperationsCommand] Reverting.");
        if (!this._oldOperations || this._oldOperations.length === 0) {
            return;
        }

        let parent: Oas30PathItem | Oas20PathItem = this._parentPath.resolve(document) as any;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        this._oldOperations.forEach( oldOperationData => {
            let method: string = oldOperationData["_method"];
            let operation: OasOperation = parent.createOperation(method);
            this.oasLibrary().readNode(oldOperationData["_operation"], operation);
            parent[method] = operation;
        });
    }

}
