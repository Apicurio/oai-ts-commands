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
import {Oas20Document, Oas20SecurityScheme, Oas30Document, Oas30SecurityScheme, OasDocument} from "oai-ts-core";

/**
 * A command used to create a new definition in a document.
 */
export abstract class AbstractNewSecuritySchemeCommand extends AbstractCommand implements ICommand {

    protected _scheme: any;
    protected _schemeName: string;

    protected _schemeExisted: boolean;

    /**
     * C'tor.
     * @param {Oas20SecurityScheme} scheme
     */
    constructor(scheme: Oas20SecurityScheme | Oas30SecurityScheme) {
        super();
        this._scheme = this.oasLibrary().writeNode(scheme);
        this._schemeName = scheme.schemeName();
    }

    /**
     * Adds the new security scheme to the document.
     * @param document
     */
    public abstract execute(document: OasDocument): void;

    /**
     * Removes the security scheme.
     * @param document
     */
    public abstract undo(document: OasDocument): void;
}


/**
 * OAI 2.0 impl.
 */
export class NewSecuritySchemeCommand_20 extends AbstractNewSecuritySchemeCommand {

    private _nullSecurityDefinitions: boolean;

    /**
     * Adds the new security scheme to the document.
     * @param {Oas20Document} document
     */
    public execute(document: Oas20Document): void {
        console.info("[NewSecuritySchemeCommand] Executing.");

        this._nullSecurityDefinitions = false;
        if (this.isNullOrUndefined(document.securityDefinitions)) {
            document.securityDefinitions = document.createSecurityDefinitions();
            this._nullSecurityDefinitions = true;
        }

        if (this.isNullOrUndefined(document.securityDefinitions.securityScheme(this._schemeName))) {
            let scheme: Oas20SecurityScheme = document.securityDefinitions.createSecurityScheme(this._schemeName);
            this.oasLibrary().readNode(this._scheme, scheme);
            document.securityDefinitions.addSecurityScheme(this._schemeName, scheme);
            this._schemeExisted = false;
        } else {
            this._schemeExisted = true;
        }
    }

    /**
     * Removes the security scheme.
     * @param {Oas20Document} document
     */
    public undo(document: Oas20Document): void {
        console.info("[NewSecuritySchemeCommand] Reverting.");
        if (this._schemeExisted) {
            return;
        }
        if (this._nullSecurityDefinitions) {
            document.securityDefinitions = null;
            return;
        }
        document.securityDefinitions.removeSecurityScheme(this._schemeName);
    }

}


/**
 * OAI 3.0 impl.
 */
export class NewSecuritySchemeCommand_30 extends AbstractNewSecuritySchemeCommand {

    protected _nullComponents: boolean;

    /**
     * Adds the new security scheme to the document.
     * @param document
     */
    public execute(document: Oas30Document): void {
        console.info("[NewSecuritySchemeCommand] Executing.");
        this._nullComponents = false;
        if (this.isNullOrUndefined(document.components)) {
            document.components = document.createComponents();
            this._nullComponents = true;
        }

        if (this.isNullOrUndefined(document.components.getSecurityScheme(this._schemeName))) {
            let scheme: Oas30SecurityScheme = document.components.createSecurityScheme(this._schemeName);
            this.oasLibrary().readNode(this._scheme, scheme);
            document.components.addSecurityScheme(this._schemeName, scheme);
            this._schemeExisted = false;
        } else {
            this._schemeExisted = true;
        }
    }

    /**
     * Removes the security scheme.
     * @param {Oas30Document} document
     */
    public undo(document: Oas30Document): void {
        console.info("[NewSecuritySchemeCommand] Reverting.");
        if (this._schemeExisted) {
            return;
        }
        if (this._nullComponents) {
            document.components = null;
            return;
        }
        document.components.removeSecurityScheme(this._schemeName);
    }

}