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
    Oas20Parameter,
    Oas20PathItem,
    Oas30Operation,
    Oas30Parameter,
    Oas30PathItem,
    Oas30Schema,
    OasDocument,
    OasNodePath,
    OasOperation,
    OasParameterBase,
    OasPathItem
} from "oai-ts-core";
import {AbstractCommand, ICommand} from "../base";
import {MarshallUtils} from "../util/marshall.util";
import {SimplifiedParameterType} from "../models/simplified-type.model";

/**
 * Factory function.
 */
export function createNewParamCommand(document: OasDocument,
                                      parent: Oas20Operation | Oas20PathItem | Oas30Operation | Oas30PathItem,
                                      paramName: string, paramType: string,
                                      description: string = null, newType: SimplifiedParameterType = null,
                                      override: boolean = false): NewParamCommand {
    if (document.getSpecVersion() === "2.0") {
        return new NewParamCommand_20(parent, paramName, paramType, description, newType, override);
    } else {
        return new NewParamCommand_30(parent, paramName, paramType, description, newType, override);
    }
}

/**
 * A command used to create a new parameter.
 */
export abstract class NewParamCommand extends AbstractCommand implements ICommand {

    private _paramName: string;
    private _paramType: string;
    private _parentPath: OasNodePath;
    private _description: string;
    private _newType: SimplifiedParameterType;
    private _override: boolean;

    private _created: boolean;

    /**
     * Constructor.
     * @param parent
     * @param paramName
     * @param paramType
     * @param override
     */
    constructor(parent: Oas20Operation | Oas20PathItem | Oas30Operation | Oas30PathItem, paramName: string,
                paramType: string, description: string, newType: SimplifiedParameterType, override: boolean) {
        super();
        if (parent) {
            this._parentPath = this.oasLibrary().createNodePath(parent);
        }
        this._paramName = paramName;
        this._paramType = paramType;
        this._description = description;
        this._newType = newType;
        this._override = override;
    }

    /**
     * Creates a parameter.
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
        let configured: boolean = false;
        // If overriding a param from the path level, clone it!
        if (this._override) {
            let oparam: OasParameterBase = this.findOverridableParam(parent as OasOperation);
            if (oparam) {
                this.oasLibrary().readNode(this.oasLibrary().writeNode(oparam), param);
                configured = true;
            }
        }
        // If not overriding, then set the basics only.
        if (!configured) {
            param.in = this._paramType;
            param.name = this._paramName;
            if (param.in === "path") {
                param.required = true;
            }
            if (this._description) {
                param.description = this._description;
            }
            if (this._newType) {
                this._setParameterType(param as Oas20Parameter | Oas30Parameter);
            }
        }
        parent.addParameter(param);
        console.info("[NewParamCommand] Param %s of type %s created successfully.", param.name, param.in);

        this._created = true;
    }

    /**
     * Sets the parameter type.
     * @param parameter
     */
    protected _setParameterType(parameter: Oas30Parameter | Oas20Parameter): void {
        if (parameter.ownerDocument().is2xDocument()) {
            let param: Oas20Parameter = parameter as Oas20Parameter;
            if (this._newType.isRef()) {
                param.$ref = this._newType.type;
            }
            if (this._newType.isSimpleType()) {
                param.type = this._newType.type;
                param.format = this._newType.as;
            }
            if (this._newType.isEnum()) {
                param.enum = JSON.parse(JSON.stringify(this._newType.enum));
            }
            if (this._newType.isArray()) {
                param.type = "array";
                param.items = param.createItems();
                if (this._newType.of) {
                    param.items.type = this._newType.of.type;
                    param.items.format = this._newType.of.as;
                }
            }

        } else {
            let schema: Oas30Schema = parameter.createSchema() as Oas30Schema;

            if (this._newType.isRef()) {
                schema.$ref = this._newType.type;
            }
            if (this._newType.isSimpleType()) {
                schema.type = this._newType.type;
                schema.format = this._newType.as;
            }
            if (this._newType.isEnum()) {
                schema.enum = JSON.parse(JSON.stringify(this._newType.enum));
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
        }

        let required: boolean = this._newType.required;
        if (parameter.in === "path") {
            required = true;
        }
        if (required || !this.isNullOrUndefined(this._newType.required)) {
            parameter.required = required;
        }
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
        obj._newType = MarshallUtils.marshallSimplifiedParameterType(obj._newType);
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._parentPath = MarshallUtils.unmarshallNodePath(this._parentPath as any);
        this._newType = MarshallUtils.unmarshallSimplifiedParameterType(this._newType);
    }

    /**
     * Tries to find the parameter being overridden (if any).  Returns null if it can't
     * find something.
     */
    public findOverridableParam(operation: OasOperation): OasParameterBase {
        let rval: OasParameterBase = null;
        let pathItem: OasPathItem = operation.parent() as OasPathItem;
        if (pathItem && pathItem["_path"] && pathItem["parameters"] && pathItem.parameters.length > 0) {
            pathItem.parameters.forEach( piParam => {
                if (piParam.name === this._paramName && piParam.in === this._paramType) {
                    rval = piParam;
                }
            });
        }
        return rval;
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
