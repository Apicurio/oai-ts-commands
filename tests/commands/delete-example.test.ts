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
import {Oas20Document, Oas20Response, Oas30Document, Oas30Example} from "oai-ts-core";
import {createDelete20ExampleCommand, createDeleteExampleCommand} from "../../src/commands/delete-example.command";


describe("Delete Example (2.0)", () => {

    it("Delete Example", () => {
        commandTest(
            "tests/_fixtures/commands/delete-example/2.0/delete-example.before.json",
            "tests/_fixtures/commands/delete-example/2.0/delete-example.after.json",
            (document: Oas20Document) => {
                let response: Oas20Response = document.paths.pathItem("/pet/findByStatus").get.responses.response("200") as any;
                return createDelete20ExampleCommand(document, response, "application/json");
            }
        );
    });

});



describe("Delete Example (3.0)", () => {

    it("Delete Example", () => {
        commandTest(
            "tests/_fixtures/commands/delete-example/3.0/delete-example.before.json",
            "tests/_fixtures/commands/delete-example/3.0/delete-example.after.json",
            (document: Oas30Document) => {
                let example: Oas30Example = document.paths.pathItem("/").get.responses.response("200")["content"]["application/json"].examples["foo"];
                return createDeleteExampleCommand(document, example);
            }
        );
    });

});

