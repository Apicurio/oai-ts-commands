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
export function createReplaceSecurityRequirementCommand(document: OasDocument, old: OasSecurityRequirement, 
                                                        replacement: OasSecurityRequirement): ReplaceSecurityRequirementCommand {
    return new ReplaceSecurityRequirementCommand(old, replacement);
}

/**
 * A command used to replace a definition schema with a newer version.
 */
export class ReplaceSecurityRequirementCommand extends AbstractCommand implements ICommand {

    protected _parentPath: OasNodePath;
    protected _oldRequirement: any;
    protected _newRequirement: any;

    protected _replaced: boolean;

    /**
     * C'tor.
     * @param {OasSecurityRequirement} old
     * @param {OasSecurityRequirement} replacement
     */
    constructor(old: OasSecurityRequirement, replacement: OasSecurityRequirement) {
        super();
        if (old) {
            this._parentPath = this.oasLibrary().createNodePath(old.parent());
            this._oldRequirement = this.oasLibrary().writeNode(old);
        }
        if (replacement) {
            this._newRequirement = this.oasLibrary().writeNode(replacement);
        }
    }

    /**
     * @return {string}
     */
    protected type(): string {
        return "ReplaceSecurityRequirementCommand";
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
     * Replaces the security requirement with a new one.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ReplaceSecurityRequirementCommand] Executing.");
        this._replaced = false;

        let parent: OasDocument | OasOperation = this._parentPath.resolve(document) as OasDocument | OasOperation;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        let oldRequirement: OasSecurityRequirement = parent.createSecurityRequirement();
        this.oasLibrary().readNode(this._oldRequirement, oldRequirement);

        let oldIdx: number = this.indexOfRequirement(parent.security, oldRequirement);
        if (oldIdx === -1) {
            return;
        }

        let newRequirement: OasSecurityRequirement = parent.createSecurityRequirement();
        this.oasLibrary().readNode(this._newRequirement, newRequirement);
        parent.security[oldIdx] = newRequirement;

        this._replaced = true;
    }

    /**
     * Restores the old security requirement.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ReplaceSecurityRequirementCommand] Reverting.");
        if (!this._replaced) {
            return;
        }

        let parent: OasDocument | OasOperation = this._parentPath.resolve(document) as OasDocument | OasOperation;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        let replacementRequirement: OasSecurityRequirement = parent.createSecurityRequirement();
        this.oasLibrary().readNode(this._newRequirement, replacementRequirement);

        let idx: number = this.indexOfRequirement(parent.security, replacementRequirement);
        if (idx === -1) {
            return;
        }

        let originalRequirement: OasSecurityRequirement = parent.createSecurityRequirement();
        this.oasLibrary().readNode(this._oldRequirement, originalRequirement);

        parent.security[idx] = originalRequirement;
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
