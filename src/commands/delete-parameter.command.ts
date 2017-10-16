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
import {
    IOasParameterParent,
    Oas20Parameter,
    Oas30Parameter,
    OasDocument,
    OasNodePath,
    OasParameterBase
} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";


/**
 * Factory function.
 */
export function createDeleteParameterCommand(document: OasDocument, parameter: Oas20Parameter | Oas30Parameter): DeleteParameterCommand {
    if (document.getSpecVersion() === "2.0") {
        return new DeleteParameterCommand_20(parameter);
    } else {
        return new DeleteParameterCommand_30(parameter);
    }
}

/**
 * A command used to delete a single parameter from an operation.
 */
export abstract class DeleteParameterCommand extends AbstractCommand implements ICommand {

    private _parameterPath: OasNodePath;
    private _parentPath: OasNodePath;
    private _oldParameter: any;

    /**
     * C'tor.
     * @param {Oas20Parameter | Oas30Parameter} parameter
     */
    constructor(parameter: Oas20Parameter | Oas30Parameter) {
        super();
        if (parameter) {
            this._parameterPath = this.oasLibrary().createNodePath(parameter);
            this._parentPath = this.oasLibrary().createNodePath(parameter.parent());
        }
    }

    /**
     * Deletes the parameter.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteParameterCommand] Executing.");
        this._oldParameter = null;

        let param: Oas20Parameter | Oas30Parameter = this._parameterPath.resolve(document) as any;
        if (this.isNullOrUndefined(param)) {
            return;
        }

        let params: OasParameterBase[] = ((param.parent() as any) as IOasParameterParent).parameters;
        params.splice(params.indexOf(param), 1);

        this._oldParameter = this.oasLibrary().writeNode(param);
    }

    /**
     * Restore the old (deleted) parameter.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteParameterCommand] Reverting.");
        if (!this._oldParameter) {
            return;
        }

        let parent: IOasParameterParent = <any>this._parentPath.resolve(document) as IOasParameterParent;
        if (this.isNullOrUndefined(parent)) {
            return;
        }

        if (this.isNullOrUndefined(parent.parameters)) {
            parent.parameters = [];
        }

        let param = parent.createParameter();
        this.oasLibrary().readNode(this._oldParameter, param);
        parent.addParameter(param);
    }

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._parameterPath = MarshallUtils.marshallNodePath(obj._parameterPath);
        obj._parentPath = MarshallUtils.marshallNodePath(obj._parentPath);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._parameterPath = MarshallUtils.unmarshallNodePath(this._parameterPath as any);
        this._parentPath = MarshallUtils.unmarshallNodePath(this._parentPath as any);
    }

}


/**
 * OAI 2.0 impl.
 */
export class DeleteParameterCommand_20 extends DeleteParameterCommand {

    protected type(): string {
        return "DeleteParameterCommand_20";
    }

}


/**
 * OAI 3.0 impl.
 */
export class DeleteParameterCommand_30 extends DeleteParameterCommand {

    protected type(): string {
        return "DeleteParameterCommand_30";
    }

}
