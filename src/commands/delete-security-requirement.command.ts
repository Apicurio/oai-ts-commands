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
import {OasDocument, OasNodePath, OasOperation, OasSecurityRequirement} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";

/**
 * Factory function.
 */
export function createDeleteSecurityRequirementCommand(document: OasDocument, parent: OasDocument | OasOperation,
                                                       requirement: OasSecurityRequirement): DeleteSecurityRequirementCommand {
    return new DeleteSecurityRequirementCommand(parent, requirement);
}

/**
 * A command used to delete a single securityRequirement from an operation.
 */
export class DeleteSecurityRequirementCommand extends AbstractCommand implements ICommand {

    private _parentPath: OasNodePath;
    private _requirement: any;

    private _oldRequirement: any;

    /**
     * C'tor.
     * @param {OasDocument | OasOperation} parent
     * @param {OasSecurityRequirement} requirement
     */
    constructor(parent: OasDocument | OasOperation, requirement: OasSecurityRequirement) {
        super();
        if (parent) {
            this._parentPath = this.oasLibrary().createNodePath(parent);
        }
        if (requirement) {
            this._requirement = this.oasLibrary().writeNode(requirement);
        }
    }

    protected type(): string {
        return "DeleteSecurityRequirementCommand";
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
     * Deletes the security requirement.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteSecurityRequirementCommand] Executing.");
        this._oldRequirement = null;

        let parent: OasDocument | OasOperation = this._parentPath.resolve(document) as any;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        let requirement: OasSecurityRequirement = parent.createSecurityRequirement();
        this.oasLibrary().readNode(this._requirement, requirement);

        let idx: number = this.indexOfRequirement(parent.security, requirement);
        if (idx !== -1) {
            this._oldRequirement = this.oasLibrary().writeNode(parent.security[idx]);
            parent.security.splice(idx, 1);
        }
    }

    /**
     * Restore the old (deleted) requirement.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteSecurityRequirementCommand] Reverting.");
        if (this.isNullOrUndefined(this._oldRequirement)) {
            return;
        }

        let parent: OasDocument | OasOperation = this._parentPath.resolve(document) as any;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        let restoredRequirement: OasSecurityRequirement = parent.createSecurityRequirement();
        this.oasLibrary().readNode(this._oldRequirement, restoredRequirement);
        parent.addSecurityRequirement(restoredRequirement);
    }

    protected indexOfRequirement(requirements: OasSecurityRequirement[], requirement: OasSecurityRequirement): number {
        let idx: number = 0;
        for (let r of requirements) {
            if (this.isEqual(r, requirement)) {
                return idx;
            }
            idx++;
        }
        return -1;
    }

    protected isEqual(req1: OasSecurityRequirement, req2: OasSecurityRequirement): boolean {
        let names1: string[] = req1.securityRequirementNames();
        let names2: string[] = req2.securityRequirementNames();
        if (names1.length !== names2.length) {
            return false;
        }
        let rval: boolean = true;
        names1.forEach( name1 => {
            if (names2.indexOf(name1) === -1) {
                rval = false;
            }
        });
        return rval;
    }

}

