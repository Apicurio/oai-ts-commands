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
import {Oas20Document, Oas30Document, OasPathItem} from "oai-ts-core";
import {createDeleteOperationCommand} from "../src/commands/delete-operation.command";


describe("Delete Operation (2.0)", () => {

    it("Delete Operation", () => {
        commandTest(
            "tests/fixtures/delete-operation/2.0/delete-operation.before.json",
            "tests/fixtures/delete-operation/2.0/delete-operation.after.json",
            (document: Oas20Document) => {
                let pathItem: OasPathItem = document.paths.pathItem("/pet");
                return createDeleteOperationCommand(document, "post", pathItem);
            }
        );
    });

});


describe("Delete Operation (3.0)", () => {

    it("Delete Operation", () => {
        commandTest(
            "tests/fixtures/delete-operation/3.0/delete-operation.before.json",
            "tests/fixtures/delete-operation/3.0/delete-operation.after.json",
            (document: Oas30Document) => {
                let pathItem: OasPathItem = document.paths.pathItem("/foo");
                return createDeleteOperationCommand(document, "get", pathItem);
            }
        );
    });

});

