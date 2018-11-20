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
import {Oas20Document, Oas20PathItem, Oas30Document, Oas30PathItem} from "oai-ts-core";
import {createDeleteAllOperationsCommand} from "../../src/commands/delete-all-operations.command";


describe("Delete All Operations (2.0)", () => {

    it("Delete All Operations", () => {
        commandTest(
            "tests/_fixtures/commands/delete-all-operations/2.0/delete-all-operations.before.json",
            "tests/_fixtures/commands/delete-all-operations/2.0/delete-all-operations.after.json",
            (document: Oas20Document) => {
                let path: Oas20PathItem = document.paths.pathItem("/pet/{petId}") as Oas20PathItem;
                return createDeleteAllOperationsCommand(path);
            },
            false
        );
    });

});


describe("Delete All Operations (3.0)", () => {

    it("Delete All Operations", () => {
        commandTest(
            "tests/_fixtures/commands/delete-all-operations/3.0/delete-all-operations.before.json",
            "tests/_fixtures/commands/delete-all-operations/3.0/delete-all-operations.after.json",
            (document: Oas30Document) => {
                let path: Oas30PathItem = document.paths.pathItem("/foo") as Oas30PathItem;
                return createDeleteAllOperationsCommand(path);
            }
        );
    });

});

