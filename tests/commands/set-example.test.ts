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
import {Oas20Document, Oas20Response, Oas30Document, Oas30MediaType, Oas30Operation, Oas30Response} from "oai-ts-core";
import {createSetExampleCommand} from "../../src/commands/set-example.command";


describe("Set Example (2.0)", () => {

    it("Set Example", () => {
        commandTest(
            "tests/_fixtures/commands/set-example/2.0/set-example.before.json",
            "tests/_fixtures/commands/set-example/2.0/set-example.after.json",
            (document: Oas20Document) => {
                let response: Oas20Response = document.paths.pathItem("/pet/{petId}").get.responses.response("200") as Oas20Response;
                let example: any = {
                    property1: "foo",
                    property2: "bar",
                    property3: 17,
                    property4: true,
                    property5: {
                        sub1: "hello",
                        sub2: "world"
                    }
                };
                return createSetExampleCommand(document, response, example, "application/json");
            },
            true
        );
    });

    it("Replace Example", () => {
        commandTest(
            "tests/_fixtures/commands/set-example/2.0/replace-example.before.json",
            "tests/_fixtures/commands/set-example/2.0/replace-example.after.json",
            (document: Oas20Document) => {
                let response: Oas20Response = document.paths.pathItem("/pet/{petId}").get.responses.response("200") as Oas20Response;
                let example: any = {
                    foo: "bar",
                    hello: [ "world" ]
                };
                return createSetExampleCommand(document, response, example, "application/json");
            },
            true
        );
    });

});


describe("Set Example (3.0)", () => {

    it("Set Example (Request Body)", () => {
        commandTest(
            "tests/_fixtures/commands/set-example/3.0/set-example-requestBody.before.json",
            "tests/_fixtures/commands/set-example/3.0/set-example-requestBody.after.json",
            (document: Oas30Document) => {
                let operation: Oas30Operation = document.paths.pathItem("/foo").get as Oas30Operation;
                let mediaType: Oas30MediaType = operation.requestBody.content["application/json"];
                let example: any = {
                    property1: "foo",
                    property2: "bar",
                    property3: 17,
                    property4: true,
                    property5: {
                        sub1: "hello",
                        sub2: "world"
                    }
                };
                return createSetExampleCommand(document, mediaType, example);
            }
        );
    });

    it("Replace Example (Request Body)", () => {
        commandTest(
            "tests/_fixtures/commands/set-example/3.0/replace-example-requestBody.before.json",
            "tests/_fixtures/commands/set-example/3.0/replace-example-requestBody.after.json",
            (document: Oas30Document) => {
                let operation: Oas30Operation = document.paths.pathItem("/foo").get as Oas30Operation;
                let mediaType: Oas30MediaType = operation.requestBody.content["application/json"];
                let example: any = {
                    foo: "bar",
                    hello: [ "world" ]
                };
                return createSetExampleCommand(document, mediaType, example);
            }
        );
    });

    it("Set Example (Response)", () => {
        commandTest(
            "tests/_fixtures/commands/set-example/3.0/set-example-response.before.json",
            "tests/_fixtures/commands/set-example/3.0/set-example-response.after.json",
            (document: Oas30Document) => {
                let response: Oas30Response = document.paths.pathItem("/foo").get.responses.response("200") as Oas30Response;
                let mediaType: Oas30MediaType = response.content["application/json"];
                let example: any = {
                    foo: "bar",
                    hello: [ "world" ]
                };
                return createSetExampleCommand(document, mediaType, example);
            }
        );
    });

});
