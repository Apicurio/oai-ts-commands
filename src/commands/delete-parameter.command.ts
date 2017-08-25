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


/**
 * A command used to delete a single parameter from an operation.
 */
export abstract class AbstractDeleteParameterCommand extends AbstractCommand implements ICommand {

    private _parameterPath: OasNodePath;
    private _parentPath: OasNodePath;
    private _oldParameter: any;

    /**
     * C'tor.
     * @param {Oas20Parameter | Oas30Parameter} parameter
     */
    constructor(parameter: Oas20Parameter | Oas30Parameter) {
        super();
        this._parameterPath = this.oasLibrary().createNodePath(parameter);
        this._parentPath = this.oasLibrary().createNodePath(parameter.parent());
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

}


/**
 * OAI 2.0 impl.
 */
export class DeleteParameterCommand_20 extends AbstractDeleteParameterCommand {

}


/**
 * OAI 3.0 impl.
 */
export class DeleteParameterCommand_30 extends AbstractDeleteParameterCommand {

}
