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
import {OasDocument, OasNodePath, OasOperation} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";
import {OasSecurityRequirement} from "oai-ts-core/src/models/common/security-requirement.model";

/**
 * Factory function.
 */
export function createDeleteAllSecurityRequirementsCommand(parent: OasDocument | OasOperation): DeleteAllSecurityRequirementsCommand {
    return new DeleteAllSecurityRequirementsCommand(parent);
}

/**
 * A command used to delete all security requirements from a document or operation.
 */
export class DeleteAllSecurityRequirementsCommand extends AbstractCommand implements ICommand {

    protected _parentPath: OasNodePath;
    private _oldSecurityRequirements: any[];

    /**
     * C'tor.
     */
    constructor(parent: OasDocument | OasOperation) {
        super();
        if (parent) {
            this._parentPath = this.oasLibrary().createNodePath(parent);
        }
    }

    protected type(): string {
        return "DeleteAllSecurityRequirementsCommand";
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
     * Deletes the security requirements.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteAllSecurityRequirementsCommand] Executing.");
        this._oldSecurityRequirements = [];

        let parent: OasDocument | OasOperation = this._parentPath.resolve(document) as any;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        // Save the old security-requirements (if any)
        if (!this.isNullOrUndefined(parent.security)) {
            parent.security.forEach( req => {
                this._oldSecurityRequirements.push(this.oasLibrary().writeNode(req));
            });
        }

        parent.security = [];
    }

    /**
     * Restore the old (deleted) property.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteAllSecurityRequirementsCommand] Reverting.");
        if (this._oldSecurityRequirements.length === 0) {
            return;
        }

        let parent: OasDocument | OasOperation = this._parentPath.resolve(document) as any;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        if (this.isNullOrUndefined(parent.security)) {
            parent.security = [];
        }
        this._oldSecurityRequirements.forEach( oldSecurityRequirement => {
            let requirement: OasSecurityRequirement = parent.createSecurityRequirement();
            this.oasLibrary().readNode(oldSecurityRequirement, requirement);
            parent.security.push(requirement);
        });
    }

}
