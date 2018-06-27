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
import {Oas30Document, Oas30Operation, Oas30PathItem} from "oai-ts-core";
import {createDeleteAllServersCommand} from "../../src/commands/delete-all-servers.command";


describe("Delete All Servers (3.0)", () => {

    it("Delete All Servers (Document)", () => {
        commandTest(
            "tests/_fixtures/commands/delete-all-servers/3.0/delete-all-servers-document.before.json",
            "tests/_fixtures/commands/delete-all-servers/3.0/delete-all-servers-document.after.json",
            (document: Oas30Document) => {
                return createDeleteAllServersCommand(document);
            }
        );
    });

    it("Delete All Servers (Path Item)", () => {
        commandTest(
            "tests/_fixtures/commands/delete-all-servers/3.0/delete-all-servers-pathItem.before.json",
            "tests/_fixtures/commands/delete-all-servers/3.0/delete-all-servers-pathItem.after.json",
            (document: Oas30Document) => {
                let pathItem: Oas30PathItem = document.paths.pathItem("/foo") as Oas30PathItem;
                return createDeleteAllServersCommand(pathItem);
            }
        );
    });

    it("Delete All Servers (Operation)", () => {
        commandTest(
            "tests/_fixtures/commands/delete-all-servers/3.0/delete-all-servers-operation.before.json",
            "tests/_fixtures/commands/delete-all-servers/3.0/delete-all-servers-operation.after.json",
            (document: Oas30Document) => {
                let operation: Oas30Operation = document.paths.pathItem("/foo").get as Oas30Operation;
                return createDeleteAllServersCommand(operation);
            }
        );
    });

});

