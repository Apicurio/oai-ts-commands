///<reference path="../../node_modules/@types/jasmine/index.d.ts"/>

/**
 * @license
 * Copyright 2018 JBoss Inc
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
import {Oas20Document, Oas30Document, Oas30Operation, OasExtensibleNode} from "oai-ts-core";
import {createSetExtensionCommand} from "../../src/commands/set-extension.command";


describe("Set Extension (2.0)", () => {

    it("Set Extension", () => {
        commandTest(
            "tests/_fixtures/commands/set-extension/2.0/set-extension.before.json",
            "tests/_fixtures/commands/set-extension/2.0/set-extension.after.json",
            (document: Oas20Document) => {
                let node: OasExtensibleNode = document.paths.pathItem("/pet/{petId}").get;
                let extension: any = {
                    property1: "foo",
                    property2: "bar"
                };
                return createSetExtensionCommand(document, node, "x-zimbabwe", extension);
            }
        );
    });

    it("Replace Extension", () => {
        commandTest(
            "tests/_fixtures/commands/set-extension/2.0/replace-extension.before.json",
            "tests/_fixtures/commands/set-extension/2.0/replace-extension.after.json",
            (document: Oas20Document) => {
                let node: OasExtensibleNode = document.paths.pathItem("/pet/{petId}").get;
                let extension: any = {
                    foo: "bar",
                    hello: [ "world" ]
                };
                return createSetExtensionCommand(document, node, "x-existing-extension", extension);
            }
        );
    });

});


describe("Set Extension (3.0)", () => {

    it("Set Extension (Request Body)", () => {
        commandTest(
            "tests/_fixtures/commands/set-extension/3.0/set-extension.before.json",
            "tests/_fixtures/commands/set-extension/3.0/set-extension.after.json",
            (document: Oas30Document) => {
                let operation: Oas30Operation = document.paths.pathItem("/foo").get as Oas30Operation;
                let extension: any = {
                    property1: "foo",
                    property2: "bar"
                };
                return createSetExtensionCommand(document, operation, "x-operation-extension", extension);
            }
        );
    });

    it("Replace Extension (Request Body)", () => {
        commandTest(
            "tests/_fixtures/commands/set-extension/3.0/replace-extension.before.json",
            "tests/_fixtures/commands/set-extension/3.0/replace-extension.after.json",
            (document: Oas30Document) => {
                let operation: Oas30Operation = document.paths.pathItem("/foo").get as Oas30Operation;
                let extension: any = {
                    foo: "bar",
                    hello: [ "world" ]
                };
                return createSetExtensionCommand(document, operation, "x-existing-extension", extension);
            }
        );
    });

});
