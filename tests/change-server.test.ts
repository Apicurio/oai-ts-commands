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
import {Oas30Document, Oas30Operation, Oas30PathItem, Oas30Server, Oas30ServerVariable} from "oai-ts-core";
import {createChangeServerCommand} from "../src/commands/change-server.command";


describe("Change Server (3.0)", () => {

    it("Change Server (Document)", () => {
        commandTest(
            "tests/fixtures/change-server/3.0/change-server-document.before.json",
            "tests/fixtures/change-server/3.0/change-server-document.after.json",
            (document: Oas30Document) => {
                let server: Oas30Server = document.createServer();
                server.url = "https://staging.gigantic-server.com/v1";
                server.description = "Changed description!";
                let var1: Oas30ServerVariable = server.createServerVariable("variable-1");
                var1.description = "Variable one.";
                var1.default = "var-1-default";
                server.addServerVariable("variable-1", var1);
                let var2: Oas30ServerVariable = server.createServerVariable("variable-2");
                var2.description = "Variable two.";
                var2.default = "var-2-default";
                server.addServerVariable("variable-2", var2);

                return createChangeServerCommand(document, server);
            }
        );
    });

    it("Change Server (Path Item)", () => {
        commandTest(
            "tests/fixtures/change-server/3.0/change-server-pathItem.before.json",
            "tests/fixtures/change-server/3.0/change-server-pathItem.after.json",
            (document: Oas30Document) => {
                let pathItem: Oas30PathItem = document.paths.pathItem("/foo") as Oas30PathItem;
                let server: Oas30Server = pathItem.createServer();
                server.url = "https://staging.gigantic-server.com/v1";
                server.description = "Changed description!";
                let var1: Oas30ServerVariable = server.createServerVariable("variable-1");
                var1.description = "Variable one.";
                var1.default = "var-1-default";
                server.addServerVariable("variable-1", var1);
                let var2: Oas30ServerVariable = server.createServerVariable("variable-2");
                var2.description = "Variable two.";
                var2.default = "var-2-default";
                server.addServerVariable("variable-2", var2);
                return createChangeServerCommand(document, server);
            },
            true
        );
    });

    it("Change Server (Operation)", () => {
        commandTest(
            "tests/fixtures/change-server/3.0/change-server-operation.before.json",
            "tests/fixtures/change-server/3.0/change-server-operation.after.json",
            (document: Oas30Document) => {
                let operation: Oas30Operation = document.paths.pathItem("/foo").get as Oas30Operation;
                let server: Oas30Server = operation.createServer();
                server.url = "https://staging.gigantic-server.com/v1";
                server.description = "Changed description!";
                let var1: Oas30ServerVariable = server.createServerVariable("variable-1");
                var1.description = "Variable one.";
                var1.default = "var-1-default";
                server.addServerVariable("variable-1", var1);
                let var2: Oas30ServerVariable = server.createServerVariable("variable-2");
                var2.description = "Variable two.";
                var2.default = "var-2-default";
                server.addServerVariable("variable-2", var2);
                return createChangeServerCommand(document, server);
            }
        );
    });

});

