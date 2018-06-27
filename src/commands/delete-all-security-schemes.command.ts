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
 * Factory function.
 */
export function createDeleteAllSecuritySchemesCommand(): DeleteAllSecuritySchemesCommand {
    return new DeleteAllSecuritySchemesCommand();
}

/**
 * A command used to delete all security schemes from a document or operation.
 */
export class DeleteAllSecuritySchemesCommand extends AbstractCommand implements ICommand {

    private _oldSecuritySchemes: any[];

    /**
     * C'tor.
     */
    constructor() {
        super();
    }

    protected type(): string {
        return "DeleteAllSecuritySchemesCommand";
    }

    /**
     * Deletes the security schemes.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteAllSecuritySchemesCommand] Executing.");
        this._oldSecuritySchemes = [];

        // Logic for a 2.0 doc
        if (document.is2xDocument()) {
            let doc: Oas20Document = document as Oas20Document;
            if (!this.isNullOrUndefined(doc.securityDefinitions)) {
                doc.securityDefinitions.securitySchemes().forEach(scheme => {
                    let savedScheme: any = this.oasLibrary().writeNode(scheme);
                    savedScheme["__name"] = scheme.schemeName();
                    this._oldSecuritySchemes.push(savedScheme);
                });
            }
            doc.securityDefinitions = null;
        }

        // Logic for a 3.0 doc
        if (document.is3xDocument()) {
            let doc: Oas30Document = document as Oas30Document;
            if (!this.isNullOrUndefined(doc.components)) {
                doc.components.getSecuritySchemes().forEach( scheme => {
                    let savedScheme: any = this.oasLibrary().writeNode(scheme);
                    savedScheme["__name"] = scheme.schemeName();
                    this._oldSecuritySchemes.push(savedScheme);
                    doc.components.removeSecurityScheme(scheme.schemeName());
                });
            }
        }
    }

    /**
     * Restore the old (deleted) property.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteAllSecuritySchemesCommand] Reverting.");
        if (this._oldSecuritySchemes.length === 0) {
            return;
        }

        // Logic for a 2.0 doc
        if (document.is2xDocument()) {
            let doc: Oas20Document = document as Oas20Document;
            if (this.isNullOrUndefined(doc.securityDefinitions)) {
                doc.securityDefinitions = doc.createSecurityDefinitions();
            }
            this._oldSecuritySchemes.forEach( savedScheme => {
                let name: string = savedScheme["__name"];
                let scheme: Oas20SecurityScheme = doc.securityDefinitions.createSecurityScheme(name);
                this.oasLibrary().readNode(savedScheme, scheme);
                doc.securityDefinitions.addSecurityScheme(name, scheme);
            });
        }

        // Logic for a 3.0 doc
        if (document.is3xDocument()) {
            let doc: Oas30Document = document as Oas30Document;
            if (this.isNullOrUndefined(doc.components)) {
                doc.components = doc.createComponents();
            }
            this._oldSecuritySchemes.forEach( savedScheme => {
                let name: string = savedScheme["__name"];
                let scheme: Oas30SecurityScheme = doc.components.createSecurityScheme(name);
                this.oasLibrary().readNode(savedScheme, scheme);
                doc.components.addSecurityScheme(name, scheme);
            });
        }
    }

}
