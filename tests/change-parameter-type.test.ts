///<reference path="../node_modules/@types/jasmine/index.d.ts"/>
///<reference path="@types/karma-read-json/index.d.ts"/>
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
    ChangeParameterDefinitionTypeCommand_20, ChangeParameterDefinitionTypeCommand_30,
    ChangeParameterTypeCommand_20, ChangeParameterTypeCommand_30
} from "../src/commands/change-parameter-type.command";
import {SimplifiedType} from "../src/models/simplified-type.model";
import {
    Oas20Document, Oas20Parameter, Oas20ParameterDefinition, Oas30Document, Oas30Parameter,
    Oas30ParameterDefinition
} from "oai-ts-core";


describe("Change Parameter Type (2.0)", () => {

    it("Add Parameter Type", () => {
        commandTest(
            "tests/fixtures/change-parameter-type/2.0/add-parameter-type.before.json",
            "tests/fixtures/change-parameter-type/2.0/add-parameter-type.after.json",
            (document: Oas20Document) => {
                let param: Oas20Parameter = document.paths.pathItem("/pets").get.parameters[0] as Oas20Parameter;
                let type: SimplifiedType = new SimplifiedType();
                type.type = "array";
                type.of = new SimplifiedType();
                type.of.type = "integer";
                type.of.as = "int64";
                return new ChangeParameterTypeCommand_20(param, type);
            }
        );
    });

    it("Change Parameter Type", () => {
        commandTest(
            "tests/fixtures/change-parameter-type/2.0/change-parameter-type.before.json",
            "tests/fixtures/change-parameter-type/2.0/change-parameter-type.after.json",
            (document: Oas20Document) => {
                let param: Oas20Parameter = document.paths.pathItem("/pets").get.parameters[0] as Oas20Parameter;
                let type: SimplifiedType = new SimplifiedType();
                type.type = "array";
                type.of = new SimplifiedType();
                type.of.type = "integer";
                type.of.as = "int64";
                return new ChangeParameterTypeCommand_20(param, type);
            }
        );
    });

    it("Change Parameter Definition Type", () => {
        commandTest(
            "tests/fixtures/change-parameter-type/2.0/change-parameter-definition-type.before.json",
            "tests/fixtures/change-parameter-type/2.0/change-parameter-definition-type.after.json",
            (document: Oas20Document) => {
                let param: Oas20ParameterDefinition = document.parameters.parameter("skipParam");
                let type: SimplifiedType = new SimplifiedType();
                type.type = "integer";
                type.as = "int32";
                return new ChangeParameterDefinitionTypeCommand_20(param, type);
            }
        );
    });

});


describe("Change Parameter Type (3.0)", () => {

    it("Add Parameter Type", () => {
        commandTest(
            "tests/fixtures/change-parameter-type/3.0/add-parameter-type.before.json",
            "tests/fixtures/change-parameter-type/3.0/add-parameter-type.after.json",
            (document: Oas30Document) => {
                let param: Oas30Parameter = document.paths.pathItem("/foo").get.parameters[0] as Oas30Parameter;
                let type: SimplifiedType = new SimplifiedType();
                type.type = "string";
                return new ChangeParameterTypeCommand_30(param, type);
            }
        );
    });

    it("Change Parameter Type", () => {
        commandTest(
            "tests/fixtures/change-parameter-type/3.0/change-parameter-type.before.json",
            "tests/fixtures/change-parameter-type/3.0/change-parameter-type.after.json",
            (document: Oas30Document) => {
                let param: Oas30Parameter = document.paths.pathItem("/foo").get.parameters[0] as Oas30Parameter;
                let type: SimplifiedType = new SimplifiedType();
                type.type = "string";
                return new ChangeParameterTypeCommand_30(param, type);
            }
        );
    });

    it("Change Parameter Definition Type", () => {
        commandTest(
            "tests/fixtures/change-parameter-type/3.0/change-parameter-definition-type.before.json",
            "tests/fixtures/change-parameter-type/3.0/change-parameter-definition-type.after.json",
            (document: Oas30Document) => {
                let param: Oas30ParameterDefinition = document.components.getParameterDefinition("Param1");
                let type: SimplifiedType = new SimplifiedType();
                type.type = "string";
                return new ChangeParameterDefinitionTypeCommand_30(param, type);
            }
        );
    });

});
