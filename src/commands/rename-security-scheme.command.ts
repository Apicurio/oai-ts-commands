/**
 * @license
 * Copyright 2019 JBoss Inc
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
    Oas20Document,
    Oas20SecurityScheme,
    Oas30Document,
    Oas30SecurityScheme, OasCombinedVisitorAdapter, OasContact,
    OasDocument, OasInfo, OasLicense, OasOperation, OasPathItem, OasPaths, OasSecurityRequirement,
    OasSecurityScheme, OasVisitorUtil
} from "oai-ts-core";

/**
 * Factory function.
 */
export function createRenameSecuritySchemeCommand(oldSchemeName: string, newSchemeName: string): RenameSecuritySchemeCommand {
    return new RenameSecuritySchemeCommand(oldSchemeName, newSchemeName);
}

/**
 * A command used to rename a security scheme, along with all references to it.
 */
export class RenameSecuritySchemeCommand extends AbstractCommand implements ICommand {

    private _oldSchemeName: string;
    private _newSchemeName: string;

    /**
     * C'tor.
     * @param oldSchemeName
     * @param newSchemeName
     */
    constructor(oldSchemeName: string, newSchemeName: any) {
        super();
        this._oldSchemeName = oldSchemeName;
        this._newSchemeName = newSchemeName;
    }

    protected type(): string {
        return "RenameSecuritySchemeCommand";
    }

    /**
     * Renames a security scheme.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[RenameSecuritySchemeCommand] Executing.");
        this._doSecuritySchemeRename(document, this._oldSchemeName, this._newSchemeName);
    }

    /**
     * Restores the previous security scheme name.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[RenameSecuritySchemeCommand] Reverting.");
        this._doSecuritySchemeRename(document, this._newSchemeName, this._oldSchemeName);
    }

    /**
     * Does the work of renaming a path from one name to another.
     * @param document
     * @param from
     * @param to
     * @private
     */
    private _doSecuritySchemeRename(document: OasDocument, from: string, to: string): void {
        let scheme: OasSecurityScheme = null;

        // Different place to find the security scheme depending on the version.
        if (document.is2xDocument()) {
            let doc20: Oas20Document = <Oas20Document>document;
            if (doc20.securityDefinitions) {
                // If the "to" scheme already exists, do nothing!
                if (!this.isNullOrUndefined(doc20.securityDefinitions.securityScheme(to))) {
                    return;
                }
                scheme = doc20.securityDefinitions.removeSecurityScheme(from);
            }
        } else {
            let doc30: Oas30Document = <Oas30Document>document;
            if (doc30.components) {
                // If the "to" scheme already exists, do nothing!
                if (!this.isNullOrUndefined(doc30.components.getSecurityScheme(to))) {
                    return;
                }
                scheme = doc30.components.removeSecurityScheme(from);
            }
        }

        // If we didn't find a scheme with the "from" name, then nothing to do.
        if (this.isNullOrUndefined(scheme)) {
            return;
        }

        // Now we have the scheme - rename it!
        scheme["_schemeName"] = to;
        if (document.is2xDocument()) {
            let doc20: Oas20Document = <Oas20Document>document;
            doc20.securityDefinitions.addSecurityScheme(to, <Oas20SecurityScheme>scheme);
        } else {
            let doc30: Oas30Document = <Oas30Document>document;
            doc30.components.addSecurityScheme(to, <Oas30SecurityScheme>scheme);
        }

        // Now find all security requirements that reference the scheme and change them too.
        OasVisitorUtil.visitTree(document, new class extends OasCombinedVisitorAdapter {
            public visitSecurityRequirement(node: OasSecurityRequirement): void {
                let scopes: string[] = node.removeSecurityRequirementItem(from);
                if (scopes !== undefined) {
                    node.addSecurityRequirementItem(to, scopes);
                }
            }
        });
    }
}
