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
import {Oas30Document, Oas30Operation} from "oai-ts-core";
import {createDeleteRequestBodyCommand} from "../src/commands/delete-request-body.command";


describe("Delete Request Body (3.0)", () => {

    it("Delete Request Body", () => {
        commandTest(
            "tests/fixtures/delete-request-body/3.0/delete-request-body.before.json",
            "tests/fixtures/delete-request-body/3.0/delete-request-body.after.json",
            (document: Oas30Document) => {
                let operation: Oas30Operation = document.paths.pathItem("/v2").put as Oas30Operation;
                return createDeleteRequestBodyCommand(document, operation);
            }
        );
    });

});

