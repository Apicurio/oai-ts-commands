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
    OasCombinedVisitorAdapter,
    OasDocument,
    OasNodePath,
    OasOperation,
    OasParameterBase,
    OasPathItem
} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";

/**
 * Factory function.
 */
export function createRenameParameterCommand(parent: OasPathItem | OasOperation, oldParamName: string, newParamName: string, paramIn: string): RenameParameterCommand {
    return new RenameParameterCommand(parent, oldParamName, newParamName, paramIn);
}

/**
 * A command used to rename a parameter.
 */
export class RenameParameterCommand extends AbstractCommand implements ICommand {

    private _parentPath: OasNodePath;
    private _oldParamName: string;
    private _newParamName: string;
    private _paramIn: string;

    /**
     * C'tor.
     * @param oldParamName
     * @param newParamName
     */
    constructor(parent: OasPathItem | OasOperation, oldParamName: string, newParamName: string, paramIn: string) {
        super();
        this._oldParamName = oldParamName;
        this._newParamName = newParamName;
        this._paramIn = paramIn;
        if (!this.isNullOrUndefined(parent)) {
            this._parentPath = this.oasLibrary().createNodePath(parent);
        }
    }

    protected type(): string {
        return "RenameParameterCommand";
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
     * Renames a property.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[RenameParameterCommand] Executing.");
        this._doParameterRename(document, this._oldParamName, this._newParamName);
    }

    /**
     * Restores the previous param name.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[RenameParameterCommand] Reverting.");
        this._doParameterRename(document, this._newParamName, this._oldParamName);
    }

    /**
     * Does the work of renaming a param from one name to another.
     * @param document
     * @param from
     * @param to
     * @private
     */
    private _doParameterRename(document: OasDocument, from: string, to: string): void {
        let parent: OasPathItem | OasOperation = this._parentPath.resolve(document) as any;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        // Find the param being changed, if not present bail.
        let param: OasParameterBase = this._findParameter(parent, from);
        if (this.isNullOrUndefined(param)) {
            return;
        }

        // Start a list of all the params we're going to rename.
        let allParams: OasParameterBase[] = [];
        allParams.push(param);
        // param.name = to;

        // Detect what type of parent we're dealing with.
        let isPathItem: boolean = false;
        let isOperation: boolean = false;
        parent.accept(new class extends OasCombinedVisitorAdapter {
            public visitPathItem(node: OasPathItem): void { isPathItem = true; }
            public visitOperation(node: OasOperation): void { isOperation = true; }
        });

        let methods: string[] = [ "get", "put", "post", "delete", "options", "head", "patch", "trace" ];

        // If the parent is a path item, then we also need to rename any overriding operation params.
        if (isPathItem) {
            let pathItem: OasPathItem = <OasPathItem>parent;
            for (let method of methods) {
                let op: OasOperation = <OasOperation>(pathItem[method]);
                if (!this.isNullOrUndefined(op)) {
                    let opParam: OasParameterBase = this._findParameter(op, from);
                    if (!this.isNullOrUndefined(opParam)) {
                        allParams.push(opParam);
                    }
                }
            }
        }

        // If the parent is an operation, then we also need to rename any param defined at the path level.  And if
        // there IS a param defined at the path level, we'll also need to rename all params in our peer operations.
        if (isOperation) {
            let operation: OasOperation = <OasOperation>parent;
            let pathItem: OasPathItem = <OasPathItem>operation.parent();
            let pparam: OasParameterBase = this._findParameter(pathItem, from);
            if (!this.isNullOrUndefined(pparam)) {
                allParams.push(pparam);
                for (let method of methods) {
                    let peerOperation: OasOperation = <OasOperation>(pathItem[method]);
                    if (!this.isNullOrUndefined(peerOperation) && peerOperation !== operation) {
                        let opParam: OasParameterBase = this._findParameter(peerOperation, from);
                        if (!this.isNullOrUndefined(opParam)) {
                            allParams.push(opParam);
                        }
                    }
                }
            }
        }

        // Now actually do the rename.
        allParams.forEach( param => {
            param.name = to;
        });
    }

    /**
     * Finds a parameter from a path or operation by name.  Returns null if not found.
     * @param parent
     * @param paramName
     * @private
     */
    private _findParameter(parent: OasPathItem | OasOperation, paramName: string): OasParameterBase {
        if (this.isNullOrUndefined(parent.parameters)) {
            return null;
        }
        let params: OasParameterBase[] = parent.getParameters(this._paramIn);
        for (let param of params) {
            if (param.name === paramName) {
                return param;
            }
        }
        return null;
    }
}
