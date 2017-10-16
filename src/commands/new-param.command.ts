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

import {
    IOasParameterParent,
    Oas20Operation,
    Oas20PathItem,
    Oas30Operation,
    Oas30PathItem,
    OasDocument,
    OasNodePath,
    OasParameterBase
} from "oai-ts-core";
import {AbstractCommand, ICommand} from "../base";
import {MarshallUtils} from "../util/marshall.util";

/**
 * Factory function.
 */
export function createNewParamCommand(document: OasDocument,
                                      operation: Oas20Operation | Oas20PathItem | Oas30Operation | Oas30PathItem,
                                      paramName: string, paramType: string): NewParamCommand {
    if (document.getSpecVersion() === "2.0") {
        return new NewParamCommand_20(operation, paramName, paramType);
    } else {
        return new NewParamCommand_30(operation, paramName, paramType);
    }
}

/**
 * A command used to create a new parameter.
 */
export abstract class NewParamCommand extends AbstractCommand implements ICommand {

    private _paramName: string;
    private _paramType: string;
    private _parentPath: OasNodePath;

    private _created: boolean;

    /**
     * Constructor.
     * @param operation
     * @param paramName
     * @param paramType
     */
    constructor(operation: Oas20Operation | Oas20PathItem | Oas30Operation | Oas30PathItem, paramName: string, paramType: string) {
        super();
        if (operation) {
            this._parentPath = this.oasLibrary().createNodePath(operation);
        }
        this._paramName = paramName;
        this._paramType = paramType;
    }

    /**
     * Creates a request body parameter for the operation.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[NewParamCommand] Executing.");

        this._created = false;

        let parent: IOasParameterParent = <any>this._parentPath.resolve(document) as IOasParameterParent;

        if (this.isNullOrUndefined(parent)) {
            console.info("[NewParamCommand] Parent node (operation or path item) is null.");
            return;
        }

        if (this.hasParam(this._paramName, this._paramType, parent)) {
            console.info("[NewParamCommand] Param %s of type %s already exists.", this._paramName, this._paramType);
            return;
        }

        if (this.isNullOrUndefined(parent.parameters)) {
            parent.parameters = [];
        }

        let param: OasParameterBase = parent.createParameter() as OasParameterBase;
        param.in = this._paramType;
        param.name = this._paramName;
        if (param.in === "path") {
            param.required = true;
        }
        parent.addParameter(param);
        console.info("[NewParamCommand] Param %s of type %s created successfully.", param.name, param.in);

        this._created = true;
    }

    /**
     * Removes the previously created param.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[NewParamCommand] Reverting.");
        if (!this._created) {
            return;
        }

        let parent: IOasParameterParent = <any>this._parentPath.resolve(document) as IOasParameterParent;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        let theParam: OasParameterBase = null;
        for (let param of parent.parameters) {
            if (param.in === this._paramType && param.name === this._paramName) {
                theParam = param as OasParameterBase;
                break;
            }
        }

        // If found, remove it from the params.
        if (theParam) {
            parent.parameters.splice(parent.parameters.indexOf(theParam), 1);

            if (parent.parameters.length === 0) {
                parent.parameters = null;
            }
        }
    }

    /**
     * Returns true if the given param already exists in the parent.
     * @param paramName
     * @param paramType
     * @param parent
     * @returns {boolean}
     */
    private hasParam(paramName: string, paramType: string, parent: IOasParameterParent): boolean {
        return parent.parameters && parent.parameters.filter((value) => {
            return value.in === paramType && value.name === paramName;
        }).length > 0;
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

}


/**
 * OAI 2.0 impl.
 */
export class NewParamCommand_20 extends NewParamCommand {

    protected type(): string {
        return "NewParamCommand_20";
    }

}


/**
 * OAI 3.0 impl.
 */
export class NewParamCommand_30 extends NewParamCommand {

    protected type(): string {
        return "NewParamCommand_30";
    }

}
