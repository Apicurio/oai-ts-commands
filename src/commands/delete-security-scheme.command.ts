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
    Oas20Document, Oas20SecurityDefinitions, Oas20SecurityScheme, Oas30Document, Oas30SecurityScheme,
    OasDocument
} from "oai-ts-core";


/**
 * A command used to delete a security scheme.
 */
export abstract class AbstractDeleteSecuritySchemeCommand extends AbstractCommand implements ICommand {

    protected _schemeName: string;

    private _oldScheme: any;

    /**
     * C'tor.
     * @param {string} schemeName
     */
    constructor(schemeName: string) {
        super();
        this._schemeName = schemeName;
    }

    /**
     * Deletes the security scheme.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteSecuritySchemeCommand] Executing.");
        this._oldScheme = null;

        this._oldScheme = this.doDeleteScheme(document);
    }

    /**
     * Restore the old (deleted) security scheme.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteSecuritySchemeCommand] Reverting.");
        this.doRestoreScheme(document, this._oldScheme);
    }

    /**
     * Deletes the scheme.
     * @param {OasDocument} document
     * @return {any}
     */
    protected abstract doDeleteScheme(document: OasDocument): any;

    /**
     * Restores the previously deleted scheme.
     * @param {OasDocument} document
     */
    protected abstract doRestoreScheme(document: OasDocument, oldScheme: any): void;
}


/**
 * OAI 2.0 impl.
 */
export class DeleteSecuritySchemeCommand_20 extends AbstractDeleteSecuritySchemeCommand {

    /**
     * Delete the scheme.
     * @param {Oas20Document} document
     * @return {any}
     */
    protected doDeleteScheme(document: Oas20Document): any {
        let definitions: Oas20SecurityDefinitions = document.securityDefinitions;
        if (this.isNullOrUndefined(definitions)) {
            return;
        }

        return this.oasLibrary().writeNode(definitions.removeSecurityScheme(this._schemeName));
    }

    /**
     * Restore the scheme.
     * @param {OasDocument} document
     * @param oldScheme
     */
    protected doRestoreScheme(document: Oas20Document, oldScheme: any): void {
        let definitions: Oas20SecurityDefinitions = document.securityDefinitions;
        if (this.isNullOrUndefined(definitions) || this.isNullOrUndefined(oldScheme)) {
            return;
        }

        let scheme: Oas20SecurityScheme = definitions.createSecurityScheme(this._schemeName);
        this.oasLibrary().readNode(oldScheme, scheme);
        definitions.addSecurityScheme(this._schemeName, scheme);
    }

}


/**
 * OAI 3.0 impl.
 */
export class DeleteSecuritySchemeCommand_30 extends AbstractDeleteSecuritySchemeCommand {

    /**
     * Deletes the scheme.
     * @param {OasDocument} document
     * @return {any}
     */
    protected doDeleteScheme(document: Oas30Document): any {
        if (document.components) {
            return this.oasLibrary().writeNode(document.components.removeSecurityScheme(this._schemeName));
        } else {
            return null;
        }
    }

    /**
     * Restores the scheme.
     * @param {OasDocument} document
     * @param oldScheme
     */
    protected doRestoreScheme(document: Oas30Document, oldScheme: any): void {
        if (document.components) {
            let scheme: Oas30SecurityScheme = document.components.createSecurityScheme(this._schemeName);
            this.oasLibrary().readNode(oldScheme, scheme);
            document.components.addSecurityScheme(this._schemeName, scheme);
        }
    }

}