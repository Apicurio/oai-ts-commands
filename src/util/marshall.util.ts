///<reference path="../commands/change-version.command.ts"/>
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

import {ICommand} from "../base";
import {AddPathItemCommand_20, AddPathItemCommand_30} from "../commands/add-path.command";
import {AddSchemaDefinitionCommand_20, AddSchemaDefinitionCommand_30} from "../commands/add-schema-definition.command";
import {ChangeDescriptionCommand_20, ChangeDescriptionCommand_30} from "../commands/change-description.command";
import {ChangeLicenseCommand_20, ChangeLicenseCommand_30} from "../commands/change-license.command";
import {ChangeMediaTypeTypeCommand} from "../commands/change-media-type-type.command";
import {
    ChangeParameterDefinitionTypeCommand_20,
    ChangeParameterDefinitionTypeCommand_30,
    ChangeParameterTypeCommand_20,
    ChangeParameterTypeCommand_30
} from "../commands/change-parameter-type.command";
import {ChangePropertyCommand_20, ChangePropertyCommand_30} from "../commands/change-property.command";
import {ChangeContactCommand_20, ChangeContactCommand_30} from "../commands/change-contact-info.command";
import {ChangePropertyTypeCommand_20, ChangePropertyTypeCommand_30} from "../commands/change-property-type.command";
import {
    ChangeResponseDefinitionTypeCommand_20,
    ChangeResponseTypeCommand_20
} from "../commands/change-response-type.command";
import {
    ChangeSecuritySchemeCommand_20,
    ChangeSecuritySchemeCommand_30
} from "../commands/change-security-scheme.command";
import {ChangeTitleCommand_20, ChangeTitleCommand_30} from "../commands/change-title.command";
import {ChangeVersionCommand_20, ChangeVersionCommand_30} from "../commands/change-version.command";
import {DeleteAllParametersCommand_20, DeleteAllParametersCommand_30} from "../commands/delete-all-parameters.command";
import {DeleteAllPropertiesCommand_20, DeleteAllPropertiesCommand_30} from "../commands/delete-all-properties.command";
import {DeleteMediaTypeCommand} from "../commands/delete-media-type.command";
import {DeleteParameterCommand_20, DeleteParameterCommand_30} from "../commands/delete-parameter.command";
import {DeletePathCommand_20, DeletePathCommand_30} from "../commands/delete-path.command";
import {DeletePropertyCommand_20, DeletePropertyCommand_30} from "../commands/delete-property.command";
import {DeleteResponseCommand_20, DeleteResponseCommand_30} from "../commands/delete-response.command";
import {
    DeleteSchemaDefinitionCommand_20,
    DeleteSchemaDefinitionCommand_30
} from "../commands/delete-schema-definition.command";
import {
    DeleteSecuritySchemeCommand_20,
    DeleteSecuritySchemeCommand_30
} from "../commands/delete-security-scheme.command";
import {DeleteTagCommand_20, DeleteTagCommand_30} from "../commands/delete-tag.command";
import {NewMediaTypeCommand} from "../commands/new-media-type.command";
import {NewOperationCommand_20, NewOperationCommand_30} from "../commands/new-operation.command";
import {NewParamCommand_20, NewParamCommand_30} from "../commands/new-param.command";
import {NewPathCommand_20, NewPathCommand_30} from "../commands/new-path.command";
import {NewRequestBodyCommand_20, NewRequestBodyCommand_30} from "../commands/new-request-body.command";
import {NewResponseCommand_20, NewResponseCommand_30} from "../commands/new-response.command";
import {NewSchemaDefinitionCommand_20, NewSchemaDefinitionCommand_30} from "../commands/new-schema-definition.command";
import {NewSchemaPropertyCommand_20, NewSchemaPropertyCommand_30} from "../commands/new-schema-property.command";
import {NewSecuritySchemeCommand_20, NewSecuritySchemeCommand_30} from "../commands/new-security-scheme.command";
import {NewTagCommand_20, NewTagCommand_30} from "../commands/new-tag.command";
import {ReplaceOperationCommand_20, ReplaceOperationCommand_30} from "../commands/replace-operation.command";
import {ReplacePathItemCommand_20, ReplacePathItemCommand_30} from "../commands/replace-path-item.command";
import {
    ReplaceSchemaDefinitionCommand_20,
    ReplaceSchemaDefinitionCommand_30
} from "../commands/replace-schema-definition.command";
import {OasNodePath} from "oai-ts-core";
import {SimplifiedParameterType, SimplifiedPropertyType, SimplifiedType} from "../models/simplified-type.model";
import {ModelUtils} from "./model.util";
import {DeleteOperationCommand_20, DeleteOperationCommand_30} from "../commands/delete-operation.command";
import {DeleteRequestBodyCommand_30} from "../commands/delete-request-body.command";
import {DeleteAllResponsesCommand_20, DeleteAllResponsesCommand_30} from "../commands/delete-all-responses.command";
import {DeleteContactCommand_20, DeleteContactCommand_30} from "../commands/delete-contact.command";
import {DeleteLicenseCommand_20, DeleteLicenseCommand_30} from "../commands/delete-license.command";
import {NewServerCommand} from "../commands/new-server.command";
import {DeleteServerCommand} from "../commands/delete-server.command";
import {ChangeServerCommand} from "../commands/change-server.command";
import {SetExampleCommand_20, SetExampleCommand_30} from "../commands/set-example.command";
import {
    RenameSchemaDefinitionCommand_20,
    RenameSchemaDefinitionCommand_30
} from "../commands/rename-schema-definition.command";
import {AddExampleCommand_30} from "../commands/add-example.command";


let commandFactory: any = {
    "AddExampleCommand_30": function() { return new AddExampleCommand_30(null, null, null, null, null) },
    "AddPathItemCommand_20": function() { return new AddPathItemCommand_20(null, null); },
    "AddPathItemCommand_30": function() { return new AddPathItemCommand_30(null, null); },
    "AddSchemaDefinitionCommand_20": function() { return new AddSchemaDefinitionCommand_20(null); },
    "AddSchemaDefinitionCommand_30": function() { return new AddSchemaDefinitionCommand_30(null); },
    "ChangeContactCommand_20": function() { return new ChangeContactCommand_20(null, null, null); },
    "ChangeContactCommand_30": function() { return new ChangeContactCommand_30(null, null, null); },
    "ChangeDescriptionCommand_20": function() { return new ChangeDescriptionCommand_20(null); },
    "ChangeDescriptionCommand_30": function() { return new ChangeDescriptionCommand_30(null); },
    "ChangeLicenseCommand_20": function() { return new ChangeLicenseCommand_20(null, null); },
    "ChangeLicenseCommand_30": function() { return new ChangeLicenseCommand_30(null, null); },
    "ChangeMediaTypeTypeCommand": function() { return new ChangeMediaTypeTypeCommand(null, null); },
    "ChangeParameterDefinitionTypeCommand_20": function() { return new ChangeParameterDefinitionTypeCommand_20(null, null); },
    "ChangeParameterDefinitionTypeCommand_30": function() { return new ChangeParameterDefinitionTypeCommand_30(null, null); },
    "ChangeParameterTypeCommand_20": function() { return new ChangeParameterTypeCommand_20(null, null); },
    "ChangeParameterTypeCommand_30": function() { return new ChangeParameterTypeCommand_30(null, null); },
    "ChangePropertyCommand_20": function() { return new ChangePropertyCommand_20(null, null, null); },
    "ChangePropertyCommand_30": function() { return new ChangePropertyCommand_30(null, null, null); },
    "ChangePropertyTypeCommand_20": function() { return new ChangePropertyTypeCommand_20(null, null); },
    "ChangePropertyTypeCommand_30": function() { return new ChangePropertyTypeCommand_30(null, null); },
    "ChangeResponseTypeCommand_20": function() { return new ChangeResponseTypeCommand_20(null, null); },
    "ChangeResponseDefinitionTypeCommand_20": function() { return new ChangeResponseDefinitionTypeCommand_20(null, null); },
    "ChangeSecuritySchemeCommand_20": function() { return new ChangeSecuritySchemeCommand_20(null); },
    "ChangeSecuritySchemeCommand_30": function() { return new ChangeSecuritySchemeCommand_30(null); },
    "ChangeServerCommand": function() { return new ChangeServerCommand(null); },
    "ChangeTitleCommand_20": function() { return new ChangeTitleCommand_20(null); },
    "ChangeTitleCommand_30": function() { return new ChangeTitleCommand_30(null); },
    "ChangeVersionCommand_20": function() { return new ChangeVersionCommand_20(null); },
    "ChangeVersionCommand_30": function() { return new ChangeVersionCommand_30(null); },
    "DeleteAllParametersCommand_20": function() { return new DeleteAllParametersCommand_20(null, null); },
    "DeleteAllParametersCommand_30": function() { return new DeleteAllParametersCommand_30(null, null); },
    "DeleteAllPropertiesCommand_20": function() { return new DeleteAllPropertiesCommand_20(null); },
    "DeleteAllPropertiesCommand_30": function() { return new DeleteAllPropertiesCommand_30(null); },
    "DeleteMediaTypeCommand": function() { return new DeleteMediaTypeCommand(null); },
    "DeleteOperationCommand_20": function() { return new DeleteOperationCommand_20(null, null); },
    "DeleteOperationCommand_30": function() { return new DeleteOperationCommand_30(null, null); },
    "DeleteParameterCommand_20": function() { return new DeleteParameterCommand_20(null); },
    "DeleteParameterCommand_30": function() { return new DeleteParameterCommand_30(null); },
    "DeletePathCommand_20": function() { return new DeletePathCommand_20(null); },
    "DeletePathCommand_30": function() { return new DeletePathCommand_30(null); },
    "DeletePropertyCommand_20": function() { return new DeletePropertyCommand_20(null); },
    "DeletePropertyCommand_30": function() { return new DeletePropertyCommand_30(null); },
    "DeleteResponseCommand_20": function() { return new DeleteResponseCommand_20(null); },
    "DeleteResponseCommand_30": function() { return new DeleteResponseCommand_30(null); },
    "DeleteSchemaDefinitionCommand_20": function() { return new DeleteSchemaDefinitionCommand_20(null); },
    "DeleteSchemaDefinitionCommand_30": function() { return new DeleteSchemaDefinitionCommand_30(null); },
    "DeleteSecuritySchemeCommand_20": function() { return new DeleteSecuritySchemeCommand_20(null); },
    "DeleteSecuritySchemeCommand_30": function() { return new DeleteSecuritySchemeCommand_30(null); },
    "DeleteServerCommand": function() { return new DeleteServerCommand(null); },
    "DeleteTagCommand_20": function() { return new DeleteTagCommand_20(null); },
    "DeleteTagCommand_30": function() { return new DeleteTagCommand_30(null); },
    "DeleteRequestBodyCommand_30": function() { return new DeleteRequestBodyCommand_30(null, null); },
    "DeleteAllResponsesCommand_20": function() { return new DeleteAllResponsesCommand_20(null, null); },
    "DeleteAllResponsesCommand_30": function() { return new DeleteAllResponsesCommand_30(null, null); },
    "DeleteContactCommand_20": function() { return new DeleteContactCommand_20(null, null); },
    "DeleteContactCommand_30": function() { return new DeleteContactCommand_30(null, null); },
    "DeleteLicenseCommand_20": function() { return new DeleteLicenseCommand_20(null, null); },
    "DeleteLicenseCommand_30": function() { return new DeleteLicenseCommand_30(null, null); },
    "NewMediaTypeCommand": function() { return new NewMediaTypeCommand(null, null); },
    "NewOperationCommand_20": function() { return new NewOperationCommand_20(null, null); },
    "NewOperationCommand_30": function() { return new NewOperationCommand_30(null, null); },
    "NewParamCommand_20": function() { return new NewParamCommand_20(null, null, null); },
    "NewParamCommand_30": function() { return new NewParamCommand_30(null, null, null); },
    "NewPathCommand_20": function() { return new NewPathCommand_20(null); },
    "NewPathCommand_30": function() { return new NewPathCommand_30(null); },
    "NewRequestBodyCommand_20": function() { return new NewRequestBodyCommand_20(null); },
    "NewRequestBodyCommand_30": function() { return new NewRequestBodyCommand_30(null); },
    "NewResponseCommand_20": function() { return new NewResponseCommand_20(null, null); },
    "NewResponseCommand_30": function() { return new NewResponseCommand_30(null, null); },
    "NewSchemaDefinitionCommand_20": function() { return new NewSchemaDefinitionCommand_20(null, null); },
    "NewSchemaDefinitionCommand_30": function() { return new NewSchemaDefinitionCommand_30(null, null); },
    "NewSchemaPropertyCommand_20": function() { return new NewSchemaPropertyCommand_20(null, null); },
    "NewSchemaPropertyCommand_30": function() { return new NewSchemaPropertyCommand_30(null, null); },
    "NewSecuritySchemeCommand_20": function() { return new NewSecuritySchemeCommand_20(null); },
    "NewSecuritySchemeCommand_30": function() { return new NewSecuritySchemeCommand_30(null); },
    "NewServerCommand": function() { return new NewServerCommand(null, null); },
    "NewTagCommand_20": function() { return new NewTagCommand_20(null); },
    "NewTagCommand_30": function() { return new NewTagCommand_30(null); },
    "RenameSchemaDefinitionCommand_20": function() { return new RenameSchemaDefinitionCommand_20(null, null); },
    "RenameSchemaDefinitionCommand_30": function() { return new RenameSchemaDefinitionCommand_30(null, null); },
    "ReplaceOperationCommand_20": function() { return new ReplaceOperationCommand_20(null, null); },
    "ReplaceOperationCommand_30": function() { return new ReplaceOperationCommand_30(null, null); },
    "ReplacePathItemCommand_20": function() { return new ReplacePathItemCommand_20(null, null); },
    "ReplacePathItemCommand_30": function() { return new ReplacePathItemCommand_30(null, null); },
    "ReplaceSchemaDefinitionCommand_20": function() { return new ReplaceSchemaDefinitionCommand_20(null, null); },
    "ReplaceSchemaDefinitionCommand_30": function() { return new ReplaceSchemaDefinitionCommand_30(null, null); },
    "SetExampleCommand_20": function() { return new SetExampleCommand_20(null, null, null); },
    "SetExampleCommand_30": function() { return new SetExampleCommand_30(null, null); },
};


export class MarshallUtils {

    /**
     * Marshalls the given command into a JS object and returns it.
     * @param {ICommand} command
     */
    public static marshallCommand(command: ICommand): any {
        let obj: any = command.marshall();
        return obj;
    }

    /**
     * Unmarshalls the given JS object into a command and returns it.
     * @param object
     * @return {ICommand}
     */
    public static unmarshallCommand(object: any): ICommand {
        let cmdType: string = object["__type"];
        let factory: any = commandFactory[cmdType];
        if (!factory) {
            throw new Error("No unmarshalling factory found for command type: " + cmdType);
        }
        let cmd: ICommand = factory();
        cmd.unmarshall(object);
        return cmd;
    }

    /**
     * Marshalls the given node path into a JS string.
     * @param {OasNodePath} nodePath
     * @return {any}
     */
    public static marshallNodePath(nodePath: OasNodePath): string {
        if (ModelUtils.isNullOrUndefined(nodePath)) {
            return null;
        }
        return nodePath.toString();
    }

    /**
     * Unmarshalls a node path back into an instance of OasNodePath.
     * @param path
     * @return {OasNodePath}
     */
    public static unmarshallNodePath(path: string): OasNodePath {
        if (ModelUtils.isNullOrUndefined(path)) {
            return null;
        }
        let nodePath: OasNodePath = new OasNodePath(path);
        return nodePath;
    }

    /**
     * Marshalls the given simple type into a JS object.
     * @param {SimplifiedType} sType
     * @return {any}
     */
    public static marshallSimplifiedType(sType: SimplifiedType): any {
        if (ModelUtils.isNullOrUndefined(sType)) {
            return null;
        }
        let obj: any = {
            type: sType.type,
            of: MarshallUtils.marshallSimplifiedType(sType.of),
            as: sType.as
        };
        return obj;
    }

    /**
     * Unmarshalls a simple type back into a JS object.
     * @param object
     * @return {SimplifiedType}
     */
    public static unmarshallSimplifiedType(object: any): SimplifiedType {
        if (ModelUtils.isNullOrUndefined(object)) {
            return null;
        }
        let type: SimplifiedType = new SimplifiedType();
        type.type = object.type;
        type.of = MarshallUtils.unmarshallSimplifiedType(object.of);
        type.as = object.as;
        return type;
    }

    /**
     * Marshalls the given simple type into a JS object.
     * @param {SimplifiedParameterType} sType
     * @return {any}
     */
    public static marshallSimplifiedParameterType(sType: SimplifiedParameterType): any {
        if (ModelUtils.isNullOrUndefined(sType)) {
            return null;
        }
        let obj: any = {
            type: sType.type,
            of: MarshallUtils.marshallSimplifiedType(sType.of),
            as: sType.as,
            required: sType.required
        };
        return obj;
    }

    /**
     * Unmarshalls a simple parameter type back into a JS object.
     * @param object
     * @return {SimplifiedType}
     */
    public static unmarshallSimplifiedParameterType(object: any): SimplifiedParameterType {
        if (ModelUtils.isNullOrUndefined(object)) {
            return null;
        }
        let type: SimplifiedParameterType = new SimplifiedParameterType();
        type.type = object.type;
        type.of = MarshallUtils.unmarshallSimplifiedType(object.of);
        type.as = object.as;
        type.required = object.required;
        return type;
    }

    /**
     * Marshalls the given simple type into a JS object.
     * @param {SimplifiedPropertyType} sType
     * @return {any}
     */
    public static marshallSimplifiedPropertyType(sType: SimplifiedPropertyType): any {
        if (ModelUtils.isNullOrUndefined(sType)) {
            return null;
        }
        let obj: any = {
            type: sType.type,
            of: MarshallUtils.marshallSimplifiedType(sType.of),
            as: sType.as,
            required: sType.required
        };
        return obj;
    }

    /**
     * Unmarshalls a simple parameter type back into a JS object.
     * @param object
     * @return {SimplifiedType}
     */
    public static unmarshallSimplifiedPropertyType(object: any): SimplifiedPropertyType {
        if (ModelUtils.isNullOrUndefined(object)) {
            return null;
        }
        let type: SimplifiedPropertyType = new SimplifiedPropertyType();
        type.type = object.type;
        type.of = MarshallUtils.unmarshallSimplifiedType(object.of);
        type.as = object.as;
        type.required = object.required;
        return type;
    }

}
