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
import {Oas30Document, Oas30Operation, Oas30PathItem, OasDocument, OasNodePath} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";
import {Oas30Server} from "oai-ts-core/src/models/3.0/server.model";

/**
 * Factory function.
 */
export function createDeleteAllServersCommand(parent: Oas30Document | Oas30PathItem | Oas30Operation): DeleteAllServersCommand {
    return new DeleteAllServersCommand(parent);
}

/**
 * A command used to delete all servers from a document.
 */
export class DeleteAllServersCommand extends AbstractCommand implements ICommand {

    protected _parentPath: OasNodePath;
    private _oldServers: any[];

    /**
     * C'tor.
     */
    constructor(parent: Oas30Document | Oas30PathItem | Oas30Operation) {
        super();
        if (parent) {
            this._parentPath = this.oasLibrary().createNodePath(parent);
        }
    }

    protected type(): string {
        return "DeleteAllServersCommand";
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
        console.info("[DeleteAllServersCommand] Executing.");
        this._oldServers = [];

        let parent: Oas30Document | Oas30PathItem | Oas30Operation = this._parentPath.resolve(document) as any;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        // Save the old servers (if any)
        if (!this.isNullOrUndefined(parent.servers)) {
            parent.servers.forEach( server => {
                this._oldServers.push(this.oasLibrary().writeNode(server));
            });
        }

        parent.servers = [];
    }

    /**
     * Restore the old (deleted) property.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteAllServersCommand] Reverting.");
        if (this._oldServers.length === 0) {
            return;
        }

        let parent: Oas30Document | Oas30PathItem | Oas30Operation = this._parentPath.resolve(document) as any;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        if (this.isNullOrUndefined(parent.servers)) {
            parent.servers = [];
        }
        this._oldServers.forEach( oldServer => {
            let server: Oas30Server = parent.createServer();
            this.oasLibrary().readNode(oldServer, server);
            parent.servers.push(server);
        });
    }

}
