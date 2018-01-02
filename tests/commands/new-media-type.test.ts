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
import {Oas30Document, Oas30Operation, Oas30Parameter, Oas30Response} from "oai-ts-core";
import {createNewMediaTypeCommand} from "../../src/commands/new-media-type.command";


describe("New Media Type (3.0)", () => {

    it("New Media Type (Parameter)", () => {
        commandTest(
            "tests/_fixtures/commands/new-media-type/3.0/new-media-type-parameter.before.json",
            "tests/_fixtures/commands/new-media-type/3.0/new-media-type-parameter.after.json",
            (document: Oas30Document) => {
                let param: Oas30Parameter = document.paths.pathItem("/foo").get.parameter("query", "username") as Oas30Parameter;
                return createNewMediaTypeCommand(document, param, "application/json");
            }
        );
    });

    it("New Media Type (Request Body)", () => {
        commandTest(
            "tests/_fixtures/commands/new-media-type/3.0/new-media-type-requestBody.before.json",
            "tests/_fixtures/commands/new-media-type/3.0/new-media-type-requestBody.after.json",
            (document: Oas30Document) => {
                let operation: Oas30Operation = document.paths.pathItem("/foo").get as Oas30Operation;
                return createNewMediaTypeCommand(document, operation.requestBody, "application/json");
            }
        );
    });

    it("New Media Type (Response)", () => {
        commandTest(
            "tests/_fixtures/commands/new-media-type/3.0/new-media-type-response.before.json",
            "tests/_fixtures/commands/new-media-type/3.0/new-media-type-response.after.json",
            (document: Oas30Document) => {
                let response: Oas30Response = document.paths.pathItem("/foo").get.responses.response("200") as Oas30Response;
                return createNewMediaTypeCommand(document, response, "application/xml");
            }
        );
    });

});

