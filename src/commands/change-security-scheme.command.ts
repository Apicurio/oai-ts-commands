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
import {OasDocument, Oas20Document, Oas20SecurityScheme, Oas30SecurityScheme, Oas30Document} from "oai-ts-core";

/**
 * A command used to modify a security scheme.
 */
export abstract class AbstractChangeSecuritySchemeCommand extends AbstractCommand implements ICommand {

    protected _scheme: Oas20SecurityScheme | Oas30SecurityScheme;

    private _oldScheme: any;

    /**
     * C'tor.
     * @param {Oas20SecurityScheme} scheme
     */
    constructor(scheme: Oas20SecurityScheme | Oas30SecurityScheme) {
        super();
        this._scheme = scheme;
    }

    /**
     * Modifies the security scheme.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangeSecuritySchemeCommand] Executing.");
        this._oldScheme  = null;

        let scheme: Oas20SecurityScheme | Oas30SecurityScheme = this.getSchemeFromDocument(document);
        if (this.isNullOrUndefined(scheme)) {
            return;
        }

        // Back up the old scheme info (for undo)
        this._oldScheme = this.oasLibrary().writeNode(scheme);

        // Replace with new scheme info
        this.replaceSchemeWith(scheme, this._scheme);
    }

    /**
     * Resets the security scheme back to the original value.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangeSecuritySchemeCommand] Reverting.");
        if (this.isNullOrUndefined(this._oldScheme)) {
            return;
        }

        let scheme: Oas20SecurityScheme | Oas30SecurityScheme = this.getSchemeFromDocument(document);
        if (this.isNullOrUndefined(scheme)) {
            return;
        }

        this.nullScheme(scheme);
        this.oasLibrary().readNode(this._oldScheme, scheme);
    }

    /**
     * Gets the scheme from the document.
     * @param {OasDocument} document
     * @return {Oas20SecurityScheme | Oas30SecurityScheme}
     */
    protected abstract getSchemeFromDocument(document: OasDocument): Oas20SecurityScheme | Oas30SecurityScheme;

    /**
     * Replaces the content of a scheme with the content from another scheme.
     * @param {Oas20SecurityScheme | Oas30SecurityScheme} toScheme
     * @param {Oas20SecurityScheme | Oas30SecurityScheme} fromScheme
     */
    protected replaceSchemeWith(toScheme: Oas20SecurityScheme | Oas30SecurityScheme, fromScheme: Oas20SecurityScheme | Oas30SecurityScheme): void {
        let from: any = this.oasLibrary().writeNode(fromScheme);
        this.nullScheme(toScheme);
        this.oasLibrary().readNode(from, toScheme);
    }

    /**
     * Null out all values in the given scheme.
     * @param {Oas20SecurityScheme | Oas30SecurityScheme} scheme
     */
    protected nullScheme(scheme: Oas20SecurityScheme | Oas30SecurityScheme): void {
        scheme.description = null;
        scheme.type = null;
        scheme.name = null;
        scheme.in = null;
    }
}


/**
 * OAI 2.0 impl.
 */
export class ChangeSecuritySchemeCommand_20 extends AbstractChangeSecuritySchemeCommand {

    /**
     * Return the scheme.
     * @param {Oas20Document} document
     * @return {Oas20SecurityScheme}
     */
    protected getSchemeFromDocument(document: Oas20Document): Oas20SecurityScheme {
        if (this.isNullOrUndefined(document.securityDefinitions)) {
            return;
        }
        return document.securityDefinitions.securityScheme(this._scheme.schemeName());
    }

    /**
     * Null out the scheme.
     * @param {Oas20SecurityScheme} scheme
     */
    protected nullScheme(scheme: Oas20SecurityScheme): void {
        super.nullScheme(scheme);
        scheme.tokenUrl = null;
        scheme.authorizationUrl = null;
        scheme.flow = null;
        scheme.scopes = null;
    }

}


/**
 * OAI 3.0 impl.
 */
export class ChangeSecuritySchemeCommand_30 extends AbstractChangeSecuritySchemeCommand {

    /**
     * Return the scheme.
     * @param {Oas30Document} document
     * @return {Oas20SecurityScheme}
     */
    protected getSchemeFromDocument(document: Oas30Document): Oas30SecurityScheme {
        if (this.isNullOrUndefined(document.components)) {
            return;
        }
        return document.components.getSecurityScheme(this._scheme.schemeName());
    }

    /**
     * Null out the scheme.
     * @param {Oas30SecurityScheme} scheme
     */
    protected nullScheme(scheme: Oas30SecurityScheme): void {
        super.nullScheme(scheme);
        scheme.$ref = null;
        scheme.scheme = null;
        scheme.bearerFormat = null;
        scheme.flows = null;
        scheme.openIdConnectUrl = null;
    }

}