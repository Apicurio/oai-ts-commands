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
import {Oas20Document, Oas20Parameter, Oas30Document, Oas30Parameter} from "oai-ts-core";
import {createDeleteParameterCommand} from "../src/commands/delete-parameter.command";


describe("Delete Parameter (2.0)", () => {

    it("Delete Parameter", () => {
        commandTest(
            "tests/fixtures/delete-parameter/2.0/delete-parameter.before.json",
            "tests/fixtures/delete-parameter/2.0/delete-parameter.after.json",
            (document: Oas20Document) => {
                let param: Oas20Parameter = document.paths.pathItem("/pet/{petId}").post.parameter("formData", "status") as Oas20Parameter;
                return createDeleteParameterCommand(document, param);
            }
        );
    });

});


describe("Delete Parameter (3.0)", () => {

    it("Delete Parameter", () => {
        commandTest(
            "tests/fixtures/delete-parameter/3.0/delete-parameter.before.json",
            "tests/fixtures/delete-parameter/3.0/delete-parameter.after.json",
            (document: Oas30Document) => {
                let param: Oas30Parameter = document.paths.pathItem("/foo").get.parameter("query", "freeForm") as Oas30Parameter;
                return createDeleteParameterCommand(document, param);
            }
        );
    });

});

