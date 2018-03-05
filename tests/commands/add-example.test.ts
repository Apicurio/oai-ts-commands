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
import {Oas30Document, Oas30MediaType} from "oai-ts-core";
import {createAddExampleCommand} from "../../src/commands/add-example.command";


describe("Add Example (3.0)", () => {

    it("Add Example", () => {
        commandTest(
            "tests/_fixtures/commands/add-example/3.0/add-example.before.json",
            "tests/_fixtures/commands/add-example/3.0/add-example.after.json",
            (document: Oas30Document) => {
                let mediaType: Oas30MediaType = document.paths.pathItem("/").get.responses.response("200")["content"]["application/json"];
                let example: any = {
                    "property1": "hello",
                    "property2": "world",
                    "property3": true
                };
                return createAddExampleCommand(document, mediaType, example, "bar", "Bar Example", "The bar example!");
            }
        );
    });

    it("Add Example (First)", () => {
        commandTest(
            "tests/_fixtures/commands/add-example/3.0/add-example-first.before.json",
            "tests/_fixtures/commands/add-example/3.0/add-example-first.after.json",
            (document: Oas30Document) => {
                let mediaType: Oas30MediaType = document.paths.pathItem("/").get.responses.response("300")["content"]["application/json"];
                let example: any = "{ \"prop\": true }"
                return createAddExampleCommand(document, mediaType, example, "FOOF");
            }
        );
    });

    it("Add Example (Exists)", () => {
        commandTest(
            "tests/_fixtures/commands/add-example/3.0/add-example-exists.before.json",
            "tests/_fixtures/commands/add-example/3.0/add-example-exists.after.json",
            (document: Oas30Document) => {
                let mediaType: Oas30MediaType = document.paths.pathItem("/").get.responses.response("200")["content"]["application/json"];
                let example: any = "WILL-NOT-BE-ADDED";
                return createAddExampleCommand(document, mediaType, example, "foo");
            }
        );
    });

});
