///<reference path="../../node_modules/@types/jasmine/index.d.ts"/>

/**
 * @license
 * Copyright 2019 JBoss Inc
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
import {createRenameParameterCommand} from "../../src/commands/rename-parameter.command";
import {Oas20Document, Oas20PathItem, Oas30Document, Oas30PathItem} from "oai-ts-core";


describe("Rename Parameter (2.0)", () => {

    it("Rename Parameter", () => {
        commandTest(
            "tests/_fixtures/commands/rename-parameter/2.0/rename-parameter.before.json",
            "tests/_fixtures/commands/rename-parameter/2.0/rename-parameter.after.json",
            (document: Oas20Document) => {
                let pathItem: Oas20PathItem = <Oas20PathItem>document.paths.pathItem("/pet/findByStatus");
                return createRenameParameterCommand(pathItem.get, "status", "newParamName", "query");
            }
        );
    });

    it("Refactor Operation Parameter", () => {
        commandTest(
            "tests/_fixtures/commands/rename-parameter/2.0/refactor-operation-parameter.before.json",
            "tests/_fixtures/commands/rename-parameter/2.0/refactor-operation-parameter.after.json",
            (document: Oas20Document) => {
                let pathItem: Oas20PathItem = <Oas20PathItem>document.paths.pathItem("/pet/findByStatus");
                return createRenameParameterCommand(pathItem.get, "status", "newParamName", "query");
            }
        );
    });

    it("Refactor Path Parameter", () => {
        commandTest(
            "tests/_fixtures/commands/rename-parameter/2.0/refactor-operation-parameter.before.json",
            "tests/_fixtures/commands/rename-parameter/2.0/refactor-operation-parameter.after.json",
            (document: Oas20Document) => {
                let pathItem: Oas20PathItem = <Oas20PathItem>document.paths.pathItem("/pet/findByStatus");
                return createRenameParameterCommand(pathItem, "status", "newParamName", "query");
            }
        );
    });

});


describe("Rename Parameter (3.0)", () => {

    it("Rename Parameter", () => {
        commandTest(
            "tests/_fixtures/commands/rename-parameter/3.0/rename-parameter.before.json",
            "tests/_fixtures/commands/rename-parameter/3.0/rename-parameter.after.json",
            (document: Oas30Document) => {
                let pathItem: Oas30PathItem = <Oas30PathItem>document.paths.pathItem("/foo");
                return createRenameParameterCommand(pathItem.get, "freeForm", "newParamName", "query");
            }
        );
    });

    it("Refactor Path Parameter", () => {
        commandTest(
            "tests/_fixtures/commands/rename-parameter/3.0/refactor-path-parameter.before.json",
            "tests/_fixtures/commands/rename-parameter/3.0/refactor-path-parameter.after.json",
            (document: Oas30Document) => {
                let pathItem: Oas30PathItem = <Oas30PathItem>document.paths.pathItem("/foo");
                return createRenameParameterCommand(pathItem, "freeForm", "newParamName", "query");
            }
        );
    });

});
