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
    Oas20Document, Oas30Document, Oas30Operation, Oas30PathItem, Oas30Server, OasDocument,
    OasNodePath
} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";

/**
 * Factory function.
 */
export function createNewServerCommand(document: OasDocument, 
                                       parent: Oas30Document | Oas30PathItem | Oas30Operation, 
                                       server: Oas30Server): NewServerCommand {
    if (document.getSpecVersion() === "2.0") {
        throw new Error("Servers were introduced in OpenAPI 3.0.0.");
    } else {
        return new NewServerCommand(parent, server);
    }
}

/**
 * A command used to create a new server in a document.
 */
export class NewServerCommand extends AbstractCommand implements ICommand {

    private _parentPath: OasNodePath;
    protected _server: any;

    protected _serverExisted: boolean;

    /**
     * C'tor.
     * @param {Oas30Document | Oas30PathItem | Oas30Operation} parent
     * @param {Oas30Server} server
     */
    constructor(parent: Oas30Document | Oas30PathItem | Oas30Operation, server: Oas30Server) {
        super();
        if (!this.isNullOrUndefined(parent)) {
            this._parentPath = this.oasLibrary().createNodePath(parent);
        }
        if (!this.isNullOrUndefined(server)) {
            this._server = this.oasLibrary().writeNode(server);
        }
    }

    /**
     * @return {string}
     */
    protected type(): string {
        return "NewServerCommand";
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
     * Adds the new server to the document.
     * @param document
     */
    public execute(document: Oas30Document): void {
        console.info("[NewServerCommand] Executing.");

        let parent: Oas30Document | Oas30PathItem | Oas30Operation = document;
        if (!this.isNullOrUndefined(this._parentPath)) {
            parent = this._parentPath.resolve(document) as any;
        }

        // If the parent doesn't exist, abort!
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        if (this.isNullOrUndefined(parent.servers)) {
            parent.servers = [];
        }

        let server: Oas30Server = parent.createServer();
        this.oasLibrary().readNode(this._server, server);
        if (this.serverAlreadyExists(parent, server)) {
            this._serverExisted = true;
            return;
        } else {
            parent.servers.push(server);
            this._serverExisted = false;
        }
    }

    /**
     * Removes the security server.
     * @param {Oas30Document} document
     */
    public undo(document: Oas30Document): void {
        console.info("[NewServerCommand] Reverting.");
        if (this._serverExisted) {
            return;
        }

        let parent: Oas30Document | Oas30PathItem | Oas30Operation = document;
        if (!this.isNullOrUndefined(this._parentPath)) {
            parent = this._parentPath.resolve(document) as any;
        }

        // If the parent doesn't exist, abort!
        if (this.isNullOrUndefined(parent) || this.isNullOrUndefined(parent.servers)) {
            return;
        }

        let serverUrl: string = this._server.url;
        let server: Oas30Server = this.findServer(parent.servers, serverUrl);
        if (this.isNullOrUndefined(server)) {
            return;
        }
        parent.servers.splice(parent.servers.indexOf(server), 1);
        if (parent.servers.length === 0) {
            parent.servers = null;
        }
    }

    /**
     * Returns true if a server with the same url already exists in the parent.
     * @param {Oas30Document | Oas30PathItem | Oas30Operation} parent
     * @param {Oas30Server} server
     */
    private serverAlreadyExists(parent: Oas30Document | Oas30PathItem | Oas30Operation, server: Oas30Server): boolean {
        let rval: boolean = false;
        parent.servers.forEach( pserver => {
            if (pserver.url == server.url) {
                rval = true;
            }
        });
        return rval;
    }

    /**
     * Finds a server by its URL from an array of servers.
     * @param {Oas30Server[]} servers
     * @param {string} serverUrl
     */
    private findServer(servers: Oas30Server[], serverUrl: string): Oas30Server {
        let rval: Oas30Server = null;
        if (this.isNullOrUndefined(servers)) {
            return null;
        }
        servers.forEach( server => {
            if (server.url == serverUrl) {
                rval = server;
            }
        });
        return rval;
    }
}
