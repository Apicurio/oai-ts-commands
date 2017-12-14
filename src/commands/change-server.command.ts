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
    Oas30Document, Oas30Operation, Oas30PathItem, Oas30Server, OasDocument, OasNodePath
} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";

/**
 * Factory function.
 */
export function createChangeServerCommand(document: OasDocument, server: Oas30Server): ChangeServerCommand {
    if (document.getSpecVersion() === "2.0") {
        throw new Error("Servers are not supported in OpenAPI 2.0.");
    } else {
        return new ChangeServerCommand(server);
    }
}

/**
 * A command used to modify a server.
 */
export class ChangeServerCommand extends AbstractCommand implements ICommand {

    private _parentPath: OasNodePath;
    private _serverUrl: string;
    private _serverObj: any;

    private _oldServer: any;

    /**
     * C'tor.
     * @param {Oas30Server} server
     */
    constructor(server: Oas30Server) {
        super();
        if (!this.isNullOrUndefined(server)) {
            this._parentPath = this.oasLibrary().createNodePath(server.parent());
            this._serverUrl = server.url;
            this._serverObj = this.oasLibrary().writeNode(server);
        }
    }

    protected type(): string {
        return "ChangeServerCommand";
    }

    /**
     * Modifies the server.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangeServerCommand] Executing.");
        this._oldServer  = null;

        let parent: Oas30Document | Oas30PathItem | Oas30Operation = this._parentPath.resolve(document) as any;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        let server: Oas30Server = this.findServer(parent.servers, this._serverUrl);
        if (this.isNullOrUndefined(server)) {
            return;
        }

        // Back up the old server info (for undo)
        this._oldServer = this.oasLibrary().writeNode(server);

        // Replace with new server info
        this.replaceServerWith(server, this._serverObj);
    }

    /**
     * Resets the server back to the original value.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangeServerCommand] Reverting.");
        if (this.isNullOrUndefined(this._oldServer)) {
            return;
        }

        let parent: Oas30Document | Oas30PathItem | Oas30Operation = this._parentPath.resolve(document) as any;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        let server: Oas30Server = this.findServer(parent.servers, this._serverUrl);
        if (this.isNullOrUndefined(server)) {
            return;
        }

        this.replaceServerWith(server, this._oldServer);
    }

    /**
     * Replaces the content of a server with the content from another server.
     * @param {Oas30Server} toServer
     * @param {Oas30Server} fromServer
     */
    protected replaceServerWith(toServer: Oas30Server, fromServer: any): void {
        toServer.getServerVariables().forEach( var_ => {
            toServer.removeServerVariable(var_.name());
        });
        this.oasLibrary().readNode(fromServer, toServer);
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
