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
import {SimplifiedType} from "../../src/models/simplified-type.model";
import {Oas20Document, Oas20Response, Oas20ResponseDefinition} from "oai-ts-core";
import {
    createChangeResponseDefinitionTypeCommand,
    createChangeResponseTypeCommand
} from "../../src/commands/change-response-type.command";


describe("Change Response Type (2.0)", () => {

    it("Change Response Type", () => {
        commandTest(
            "tests/_fixtures/commands/change-response-type/2.0/change-response-type.before.json",
            "tests/_fixtures/commands/change-response-type/2.0/change-response-type.after.json",
            (document: Oas20Document) => {
                let response: Oas20Response = document.paths.pathItem("/pets").get.responses.response("200") as Oas20Response;
                let type: SimplifiedType = new SimplifiedType();
                type.type = "string";
                type.as = "date-time";
                return createChangeResponseTypeCommand(document, response, type);
            }
        );
    });

    it("Add Response Type", () => {
        commandTest(
            "tests/_fixtures/commands/change-response-type/2.0/add-response-type.before.json",
            "tests/_fixtures/commands/change-response-type/2.0/add-response-type.after.json",
            (document: Oas20Document) => {
                let response: Oas20Response = document.paths.pathItem("/pets").get.responses.response("200") as Oas20Response;
                let type: SimplifiedType = new SimplifiedType();
                type.type = "string";
                type.as = "date-time";
                return createChangeResponseTypeCommand(document, response, type);
            }
        );
    });

    it("Change Response Type (Enum)", () => {
        commandTest(
            "tests/_fixtures/commands/change-response-type/2.0/change-response-type-enum.before.json",
            "tests/_fixtures/commands/change-response-type/2.0/change-response-type-enum.after.json",
            (document: Oas20Document) => {
                let response: Oas20Response = document.paths.pathItem("/pets").get.responses.response("200") as Oas20Response;
                let type: SimplifiedType = new SimplifiedType();
                type.type = "string";
                type.enum = [ "option1", "option2" ];
                return createChangeResponseTypeCommand(document, response, type);
            }
        );
    });

});


describe("Change Response Definition Type (2.0)", () => {

    it("Change Response Definition Type", () => {
        commandTest(
            "tests/_fixtures/commands/change-response-type/2.0/change-response-definition-type.before.json",
            "tests/_fixtures/commands/change-response-type/2.0/change-response-definition-type.after.json",
            (document: Oas20Document) => {
                let response: Oas20ResponseDefinition = document.responses.response("ArrayComplexType");
                let type: SimplifiedType = new SimplifiedType();
                type.type = "string";
                type.as = "date-time";
                return createChangeResponseDefinitionTypeCommand(document, response, type);
            }
        );
    });

});

