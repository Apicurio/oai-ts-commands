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
import {Oas30Document, Oas30Operation, Oas30PathItem, Oas30Server} from "oai-ts-core";
import {createDeleteServerCommand} from "../../src/commands/delete-server.command";


describe("Delete Server (3.0)", () => {

    it("Delete Server (Document)", () => {
        commandTest(
            "tests/_fixtures/commands/delete-server/3.0/delete-server-document.before.json",
            "tests/_fixtures/commands/delete-server/3.0/delete-server-document.after.json",
            (document: Oas30Document) => {
                let server: Oas30Server = document.servers[2];
                return createDeleteServerCommand(document, server);
            }
        );
    });

    it("Delete Server (Path Item)", () => {
        commandTest(
            "tests/_fixtures/commands/delete-server/3.0/delete-server-pathItem.before.json",
            "tests/_fixtures/commands/delete-server/3.0/delete-server-pathItem.after.json",
            (document: Oas30Document) => {
                let pathItem: Oas30PathItem = document.paths.pathItem("/foo") as Oas30PathItem;
                let server: Oas30Server = pathItem.servers[2];
                return createDeleteServerCommand(document, server);
            }
        );
    });

    it("Delete Server (Operation)", () => {
        commandTest(
            "tests/_fixtures/commands/delete-server/3.0/delete-server-operation.before.json",
            "tests/_fixtures/commands/delete-server/3.0/delete-server-operation.after.json",
            (document: Oas30Document) => {
                let operation: Oas30Operation = document.paths.pathItem("/foo").get as Oas30Operation;
                let server: Oas30Server = operation.servers[2];
                return createDeleteServerCommand(document, server);
            }
        );
    });

});

