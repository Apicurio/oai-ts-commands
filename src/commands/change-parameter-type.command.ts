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
    Oas20Document,
    Oas20Parameter,
    Oas20ParameterDefinition, Oas20PropertySchema,
    Oas30Document,
    Oas30Parameter,
    Oas30ParameterBase,
    Oas30ParameterDefinition,
    Oas30Schema,
    OasDocument,
    OasNodePath,
    OasParameterBase
} from "oai-ts-core";
import {SimplifiedType} from "../models/simplified-type.model";

export class SimplifiedParameterType extends SimplifiedType {

    public static fromParameter(param: Oas20Parameter | Oas30Parameter): SimplifiedParameterType {
        let rval: SimplifiedParameterType = new SimplifiedParameterType();
        let st: SimplifiedType;
        if (param.ownerDocument().getSpecVersion() === "2.0") {
            if (param.in === "body") {
                st = SimplifiedType.fromSchema(param.schema);
            } else {
                st = SimplifiedType.fromItems(param as Oas20Parameter);
            }
        } else {
            st = SimplifiedType.fromSchema((param as Oas30Parameter).schema);
        }

        rval.type = st.type;
        rval.of = st.of;
        rval.as = st.as;
        rval.required = param.required;

        return rval;
    }

    required: boolean;

}


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
        this._paramPath = this.oasLibrary().createNodePath(parameter);
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
        let pindex: number = parent.parameters.indexOf(param);
        parent.parameters.splice(pindex, 1, oldParam);
    }

    /**
     * Changes the parameter.
     * @param {OasDocument} document
     * @param {OasParameterBase} parameter
     */
    protected abstract doChangeParameter(document: OasDocument, parameter: OasParameterBase): void;
}


/**
 * OAI 2.0 impl.
 */
export class ChangeParameterTypeCommand_20 extends ChangeParameterTypeCommand {

    /**
     * Changes the parameter.
     * @param {OasDocument} document
     * @param {Oas20Parameter} param
     */
    protected doChangeParameter(document: OasDocument, param: Oas20Parameter): void {
        // If it's a body param, change the schema child.  Otherwise change the param itself.
        if (param.in === "body") {
            param.schema = param.createSchema();

            if (this._newType.isSimpleType()) {
                param.schema.type = this._newType.type;
                param.schema.format = this._newType.as;
            }
            if (this._newType.isRef()) {
                param.schema.$ref = this._newType.type;
            }
            if (this._newType.isArray()) {
                param.schema.type = "array";
                param.schema.format = null;
                param.schema.items = param.schema.createItemsSchema();
                if (this._newType.of) {
                    if (this._newType.of.isSimpleType()) {
                        param.schema.items.type = this._newType.of.type;
                        param.schema.items.format = this._newType.of.as;
                    }
                    if (this._newType.of.isRef()) {
                        param.schema.items.$ref = this._newType.of.type;
                    }
                }
            }
        } else {
            if (this._newType.isSimpleType()) {
                param.type = this._newType.type;
                param.format = this._newType.as;
                param.items = null;
            }
            if (this._newType.isArray()) {
                param.type = "array";
                param.items = param.createItems();
                if (this._newType.of) {
                    param.items.type = this._newType.of.type;
                    param.items.format = this._newType.of.as;
                }
            }
        }
        if (!this.isNullOrUndefined(this._newType.required)) {
            param.required = this._newType.required;
        }
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
     * Resets the param type back to its previous state.
     * @param document
     */
    public undo(document: Oas20Document): void {
        console.info("[ChangeParameterDefinitionType] Reverting.");
        let param: Oas20ParameterDefinition = this._paramPath.resolve(document) as Oas20ParameterDefinition;
        if (!param) {
            return;
        }

        // Remove the old/updated parameter.
        document.parameters.removeParameter(param.parameterName());

        // Restore the parameter from before the command executed.
        let oldParam: Oas20ParameterDefinition = document.parameters.createParameter(param.parameterName());
        this.oasLibrary().readNode(this._oldParameter, oldParam);
        document.parameters.addParameter(param.parameterName(), oldParam);
    }

}



/**
 * OAI 3.0 impl.
 */
export class ChangeParameterTypeCommand_30 extends ChangeParameterTypeCommand {

    /**
     * Changes the parameter.
     * @param {OasDocument} document
     * @param {Oas30ParameterBase} parameter
     */
    protected doChangeParameter(document: OasDocument, parameter: Oas30ParameterBase): void {
        let schema: Oas30Schema = parameter.createSchema();

        if (this._newType.isRef()) {
            schema.$ref = this._newType.type;
        }
        if (this._newType.isSimpleType()) {
            schema.type = this._newType.type;
            schema.format = this._newType.as;
        }
        if (this._newType.isArray()) {
            schema.type = "array";
            schema.items = schema.createItemsSchema();
            if (this._newType.of) {
                schema.items.type = this._newType.of.type;
                schema.items.format = this._newType.of.as;
            }
        }

        parameter.schema = schema;
        if (!this.isNullOrUndefined(this._newType.required)) {
            parameter.required = this._newType.required;
        }
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