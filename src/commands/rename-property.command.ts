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
import {OasDocument, OasNodePath, OasSchema} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";

/**
 * Factory function.
 */
export function createRenamePropertyCommand(schema: OasSchema, oldPropertyName: string, newPropertyName: string): RenamePropertyCommand {
    return new RenamePropertyCommand(schema, oldPropertyName, newPropertyName);
}

/**
 * A command used to rename a schema property.
 */
export class RenamePropertyCommand extends AbstractCommand implements ICommand {

    private _parentPath: OasNodePath;
    private _oldPropertyName: string;
    private _newPropertyName: string;

    /**
     * C'tor.
     * @param parent
     * @param oldPropertyName
     * @param newPropertyName
     */
    constructor(parent: OasSchema, oldPropertyName: string, newPropertyName: any) {
        super();
        this._oldPropertyName = oldPropertyName;
        this._newPropertyName = newPropertyName;
        if (!this.isNullOrUndefined(parent)) {
            this._parentPath = this.oasLibrary().createNodePath(parent);
        }
    }

    protected type(): string {
        return "RenamePropertyCommand";
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
     * Renames a tag definition.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[RenamePropertyCommand] Executing.");
        this._doPropertyRename(document, this._oldPropertyName, this._newPropertyName);
    }

    /**
     * Restores the previous tag name.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[RenamePropertyCommand] Reverting.");
        this._doPropertyRename(document, this._newPropertyName, this._oldPropertyName);
    }

    /**
     * Does the work of renaming a path from one name to another.
     * @param document
     * @param from
     * @param to
     * @private
     */
    private _doPropertyRename(document: OasDocument, from: string, to: string): void {
        let parent: OasSchema = this._parentPath.resolve(document) as any;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        // Don't do anything if the "to" property already exists.
        if (!this.isNullOrUndefined(parent.property(to))) {
            return;
        }

        let property: OasSchema = parent.removeProperty(from);
        if (this.isNullOrUndefined(property)) {
            return;
        }
        property["_propertyName"] = to;
        parent.addProperty(to, property);

        let reqIdx: number = parent.required ? parent.required.indexOf(from) : -1;
        if (reqIdx !== -1) {
            parent.required.splice(reqIdx, 1, to);
        }
    }
}

