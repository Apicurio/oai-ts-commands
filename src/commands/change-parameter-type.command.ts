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
    Oas20ParameterDefinition,
    Oas30Document,
    Oas30Parameter,
    Oas30ParameterBase,
    Oas30ParameterDefinition,
    Oas30Schema,
    OasDocument,
    OasNodePath,
    OasParameterBase
} from "oai-ts-core";
import {SimplifiedParameterType} from "../models/simplified-type.model";
import {MarshallUtils} from "../util/marshall.util";
import {SimplifiedTypeUtil} from "../util/model.util";


/**
 * Factory function.
 */
export function createChangeParameterTypeCommand(document: OasDocument,
                                                 parameter: Oas20Parameter | Oas30Parameter,
                                                 newType: SimplifiedParameterType): ChangeParameterTypeCommand {
    if (document.getSpecVersion() === "2.0") {
        return new ChangeParameterTypeCommand_20(parameter, newType);
    } else {
        return new ChangeParameterTypeCommand_30(parameter, newType);
    }
}

/**
 * Factory function.
 */
export function createChangeParameterDefinitionTypeCommand(document: OasDocument,
                                                 parameter: Oas20ParameterDefinition | Oas30ParameterDefinition,
                                                 newType: SimplifiedParameterType): ChangeParameterTypeCommand {
    if (document.getSpecVersion() === "2.0") {
        return new ChangeParameterDefinitionTypeCommand_20(parameter as Oas20ParameterDefinition, newType);
    } else {
        return new ChangeParameterDefinitionTypeCommand_30(parameter as Oas30ParameterDefinition, newType);
    }
}

/**
 * A command used to modify the type of a parameter of an operation.
 */
export abstract class ChangeParameterTypeCommand extends AbstractCommand implements ICommand {

    protected _paramPath: OasNodePath;
    protected _newType: SimplifiedParameterType;

    protected _oldParameter: any;

    /**
     * C'tor.
     * @param {Oas20Parameter | Oas30Parameter | Oas20ParameterDefinition | Oas30ParameterDefinition} parameter
     * @param {SimplifiedParameterType} newType
     */
    constructor(parameter: Oas20Parameter | Oas30Parameter | Oas20ParameterDefinition | Oas30ParameterDefinition,
                newType: SimplifiedParameterType) {
        super();
        if (parameter) {
            this._paramPath = this.oasLibrary().createNodePath(parameter);
        }
        this._newType = newType;
    }

    /**
     * Modifies the type of an operation's parameter.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangeParameterTypeCommand] Executing.");
        let param: OasParameterBase = this._paramPath.resolve(document) as OasParameterBase;
        if (!param) {
            return;
        }

        // Save the old info (for later undo operation)
        this._oldParameter = this.oasLibrary().writeNode(param);

        // Change the parameter type
        this.doChangeParameter(document, param);
    }

    /**
     * Resets the param type back to its previous state.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangeParameterTypeCommand] Reverting.");
        let param: OasParameterBase = this._paramPath.resolve(document) as OasParameterBase;
        if (!param) {
            return;
        }

        let parent: IOasParameterParent = param.parent() as any;

        let oldParam: OasParameterBase = parent.createParameter();
        this.oasLibrary().readNode(this._oldParameter, oldParam);
        this.doRestoreParameter(param, oldParam);
        //let pindex: number = parent.parameters.indexOf(param);
        //parent.parameters.splice(pindex, 1, oldParam);
    }
    
    /**
     * Changes the parameter.
     * @param {OasDocument} document
     * @param {OasParameterBase} parameter
     */
    protected abstract doChangeParameter(document: OasDocument, parameter: OasParameterBase): void;

    /**
     * Called to resotre the given parameter back to the old settings (provided in oldParameter).
     * @param param
     * @param oldParam
     */
    protected abstract doRestoreParameter(param: OasParameterBase, oldParam: OasParameterBase): void;

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._paramPath = MarshallUtils.marshallNodePath(obj._paramPath);
        obj._newType = MarshallUtils.marshallSimplifiedParameterType(obj._newType);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._paramPath = MarshallUtils.unmarshallNodePath(this._paramPath as any);
        this._newType = MarshallUtils.unmarshallSimplifiedParameterType(this._newType);
    }

}


/**
 * OAI 2.0 impl.
 */
export class ChangeParameterTypeCommand_20 extends ChangeParameterTypeCommand {

    /**
     * @return {string}
     */
    protected type(): string {
        return "ChangeParameterTypeCommand_20";
    }

    /**
     * Changes the parameter.
     * @param {OasDocument} document
     * @param {Oas20Parameter} param
     */
    protected doChangeParameter(document: OasDocument, param: Oas20Parameter): void {
        // If it's a body param, change the schema child.  Otherwise change the param itself.
        if (param.in === "body") {
            param.schema = param.createSchema();
            SimplifiedTypeUtil.setSimplifiedType(param.schema, this._newType);
        } else {
            SimplifiedTypeUtil.setSimplifiedType(param, this._newType);
        }

        let required: boolean = this._newType.required;
        if (param.in === "path") {
            required = true;
        }
        if (!this.isNullOrUndefined(this._newType.required)) {
            param.required = required;
        }
    }

    /**
     * Restores the parameter.
     * @param parameter
     * @param oldParameter
     */
    protected doRestoreParameter(param: Oas20Parameter, oldParam: Oas20Parameter): void {
        if (param.in === "body") {
            param.schema = oldParam.schema;
            if (param.schema) {
                param.schema._parent = param;
                param.schema._ownerDocument = param.ownerDocument();
            }
        } else {
            param.type = oldParam.type;
            param.format = oldParam.format;
            param.items = oldParam.items;
            if (param.items) {
                param.items._parent = param;
                param.items._ownerDocument = param.ownerDocument();
            }
        }
        param.required = oldParam.required;
    }

}


/**
 * OAI 2.0 impl specialized for changing parameter definitions.  Differs primarily in
 * the undo logic.
 */
export class ChangeParameterDefinitionTypeCommand_20 extends ChangeParameterTypeCommand_20 {

    /**
     * C'tor.
     * @param {Oas20ParameterDefinition} parameter
     * @param {SimplifiedParameterType} newType
     */
    constructor(parameter: Oas20ParameterDefinition, newType: SimplifiedParameterType) {
        super(parameter, newType);
    }

    /**
     * @return {string}
     */
    protected type(): string {
        return "ChangeParameterDefinitionTypeCommand_20";
    }

}



/**
 * OAI 3.0 impl.
 */
export class ChangeParameterTypeCommand_30 extends ChangeParameterTypeCommand {

    /**
     * @return {string}
     */
    protected type(): string {
        return "ChangeParameterTypeCommand_30";
    }

    /**
     * Changes the parameter.
     * @param {OasDocument} document
     * @param {Oas30ParameterBase} parameter
     */
    protected doChangeParameter(document: OasDocument, parameter: Oas30ParameterBase): void {
        let schema: Oas30Schema = parameter.createSchema();
        SimplifiedTypeUtil.setSimplifiedType(schema, this._newType);
        parameter.schema = schema;
        let required: boolean = this._newType.required;
        if (parameter.in === "path") {
            required = true;
        }
        if (!this.isNullOrUndefined(this._newType.required)) {
            parameter.required = required;
        }
    }

    /**
     * Restores the parameter.
     * @param parameter
     * @param oldParameter
     */
    protected doRestoreParameter(param: Oas30ParameterBase, oldParam: Oas30ParameterBase): void {
        param.schema = oldParam.schema;
        if (param.schema) {
            param.schema._parent = param;
            param.schema._ownerDocument = param.ownerDocument();
        }
        param.required = oldParam.required;
    }

}


/**
 * OAI 3.0 impl specialized for changing parameter definitions.  Differs primarily in
 * the undo logic.
 */
export class ChangeParameterDefinitionTypeCommand_30 extends ChangeParameterTypeCommand_30 {

    /**
     * C'tor.
     * @param {Oas30ParameterDefinition} parameter
     * @param {SimplifiedParameterType} newType
     */
    constructor(parameter: Oas30ParameterDefinition, newType: SimplifiedParameterType) {
        super(parameter, newType);
    }

    /**
     * @return {string}
     */
    protected type(): string {
        return "ChangeParameterDefinitionTypeCommand_30";
    }

    /**
     * Resets the param type back to its previous state.
     * @param document
     */
    public undo(document: Oas30Document): void {
        console.info("[ChangeParameterDefinitionType] Reverting.");
        let param: Oas30ParameterDefinition = this._paramPath.resolve(document) as Oas30ParameterDefinition;
        if (!param) {
            return;
        }

        // Remove the old/updated parameter.
        document.components.removeParameterDefinition(param.parameterName());

        // Restore the parameter from before the command executed.
        let oldParam: Oas30ParameterDefinition = document.components.createParameterDefinition(param.parameterName());
        this.oasLibrary().readNode(this._oldParameter, oldParam);
        document.components.addParameterDefinition(param.parameterName(), oldParam);
    }

}