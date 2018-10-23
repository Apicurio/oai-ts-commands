///<reference path="../../node_modules/@types/jasmine/index.d.ts"/>

/**
 * @license
 * Copyright 2016 JBoss Inc
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

import {commandTest} from "./_test-utils";
import {
    Oas20Document,
    Oas20Parameter,
    Oas20ParameterDefinition,
    Oas30Document,
    Oas30Parameter,
    Oas30ParameterDefinition
} from "oai-ts-core";
import {
    createChangeParameterDefinitionTypeCommand,
    createChangeParameterTypeCommand,
} from "../../src/commands/change-parameter-type.command";
import {SimplifiedParameterType} from "../../src/models/simplified-type.model";


describe("Change Parameter Type (2.0)", () => {

    it("Add Parameter Type", () => {
        commandTest(
            "tests/_fixtures/commands/change-parameter-type/2.0/add-parameter-type.before.json",
            "tests/_fixtures/commands/change-parameter-type/2.0/add-parameter-type.after.json",
            (document: Oas20Document) => {
                let param: Oas20Parameter = document.paths.pathItem("/pets").get.parameters[0] as Oas20Parameter;
                let type: SimplifiedParameterType = new SimplifiedParameterType();
                type.type = "array";
                type.of = new SimplifiedParameterType();
                type.of.type = "integer";
                type.of.as = "int64";
                return createChangeParameterTypeCommand(document, param, type);
            }
        );
    });

    it("Change Parameter Type", () => {
        commandTest(
            "tests/_fixtures/commands/change-parameter-type/2.0/change-parameter-type.before.json",
            "tests/_fixtures/commands/change-parameter-type/2.0/change-parameter-type.after.json",
            (document: Oas20Document) => {
                let param: Oas20Parameter = document.paths.pathItem("/pets").get.parameters[0] as Oas20Parameter;
                let type: SimplifiedParameterType = new SimplifiedParameterType();
                type.type = "array";
                type.of = new SimplifiedParameterType();
                type.of.type = "integer";
                type.of.as = "int64";
                return createChangeParameterTypeCommand(document, param, type);
            }
        );
    });

    it("Change Parameter Required", () => {
        commandTest(
            "tests/_fixtures/commands/change-parameter-type/2.0/change-parameter-type-required.before.json",
            "tests/_fixtures/commands/change-parameter-type/2.0/change-parameter-type-required.after.json",
            (document: Oas20Document) => {
                let param: Oas20Parameter = document.paths.pathItem("/pets").get.parameters[1] as Oas20Parameter;
                let type: SimplifiedParameterType = SimplifiedParameterType.fromParameter(param);
                type.required = false;
                return createChangeParameterTypeCommand(document, param, type);
            }
        );
    });

    it("Change Parameter Definition Type", () => {
        commandTest(
            "tests/_fixtures/commands/change-parameter-type/2.0/change-parameter-definition-type.before.json",
            "tests/_fixtures/commands/change-parameter-type/2.0/change-parameter-definition-type.after.json",
            (document: Oas20Document) => {
                let param: Oas20ParameterDefinition = document.parameters.parameter("skipParam");
                let type: SimplifiedParameterType = new SimplifiedParameterType();
                type.type = "integer";
                type.as = "int32";
                return createChangeParameterDefinitionTypeCommand(document, param, type);
            }
        );
    });

    it("Change Parameter (Enum)", () => {
        commandTest(
            "tests/_fixtures/commands/change-parameter-type/2.0/change-parameter-type-enum.before.json",
            "tests/_fixtures/commands/change-parameter-type/2.0/change-parameter-type-enum.after.json",
            (document: Oas20Document) => {
                let param: Oas20Parameter = document.paths.pathItem("/pets").get.parameters[1] as Oas20Parameter;
                let type: SimplifiedParameterType = new SimplifiedParameterType();
                type.type = "string";
                type.enum = [
                    "option1", "option2", "option3"
                ];
                return createChangeParameterTypeCommand(document, param, type);
            }
        );
    });

});


describe("Change Parameter Type (3.0)", () => {

    it("Add Parameter Type", () => {
        commandTest(
            "tests/_fixtures/commands/change-parameter-type/3.0/add-parameter-type.before.json",
            "tests/_fixtures/commands/change-parameter-type/3.0/add-parameter-type.after.json",
            (document: Oas30Document) => {
                let param: Oas30Parameter = document.paths.pathItem("/foo").get.parameters[0] as Oas30Parameter;
                let type: SimplifiedParameterType = new SimplifiedParameterType();
                type.type = "string";
                return createChangeParameterTypeCommand(document, param, type);
            }
        );
    });

    it("Change Parameter Type", () => {
        commandTest(
            "tests/_fixtures/commands/change-parameter-type/3.0/change-parameter-type.before.json",
            "tests/_fixtures/commands/change-parameter-type/3.0/change-parameter-type.after.json",
            (document: Oas30Document) => {
                let param: Oas30Parameter = document.paths.pathItem("/foo").get.parameters[0] as Oas30Parameter;
                let type: SimplifiedParameterType = new SimplifiedParameterType();
                type.type = "string";
                return createChangeParameterTypeCommand(document, param, type);
            }
        );
    });

    it("Change Parameter Required", () => {
        commandTest(
            "tests/_fixtures/commands/change-parameter-type/3.0/change-parameter-type-required.before.json",
            "tests/_fixtures/commands/change-parameter-type/3.0/change-parameter-type-required.after.json",
            (document: Oas30Document) => {
                let param: Oas30Parameter = document.paths.pathItem("/foo").get.parameters[1] as Oas30Parameter;
                let type: SimplifiedParameterType = SimplifiedParameterType.fromParameter(param);
                type.required = true;
                return createChangeParameterTypeCommand(document, param, type);
            }
        );
    });

    it("Change Parameter Definition Type", () => {
        commandTest(
            "tests/_fixtures/commands/change-parameter-type/3.0/change-parameter-definition-type.before.json",
            "tests/_fixtures/commands/change-parameter-type/3.0/change-parameter-definition-type.after.json",
            (document: Oas30Document) => {
                let param: Oas30ParameterDefinition = document.components.getParameterDefinition("Param1");
                let type: SimplifiedParameterType = new SimplifiedParameterType();
                type.type = "string";
                return createChangeParameterDefinitionTypeCommand(document, param, type);
            }
        );
    });

    it("Change Parameter (Enum)", () => {
        commandTest(
            "tests/_fixtures/commands/change-parameter-type/3.0/change-parameter-type-enum.before.json",
            "tests/_fixtures/commands/change-parameter-type/3.0/change-parameter-type-enum.after.json",
            (document: Oas30Document) => {
                let param: Oas30Parameter = document.paths.pathItem("/foo").get.parameters[1] as Oas30Parameter;
                let type: SimplifiedParameterType = new SimplifiedParameterType();
                type.type = "string";
                type.enum = [
                    "option1", "option2", "option3"
                ];
                return createChangeParameterTypeCommand(document, param, type);
            }
        );
    });

});
