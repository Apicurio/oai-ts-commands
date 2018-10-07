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
import {Oas20Document, Oas30Document, OasExtension} from "oai-ts-core";
import {createDeleteExtensionCommand} from "../../src/commands/delete-extension.command";


describe("Delete Extension (2.0)", () => {

    it("Delete Extension", () => {
        commandTest(
            "tests/_fixtures/commands/delete-extension/2.0/delete-extension.before.json",
            "tests/_fixtures/commands/delete-extension/2.0/delete-extension.after.json",
            (document: Oas20Document) => {
                let extension: OasExtension = document.paths.pathItem("/pet/findByStatus").get.extension("x-existing-extension");
                return createDeleteExtensionCommand(document, extension);
            }
        );
    });

});



describe("Delete Extension (3.0)", () => {

    it("Delete Extension", () => {
        commandTest(
            "tests/_fixtures/commands/delete-extension/3.0/delete-extension.before.json",
            "tests/_fixtures/commands/delete-extension/3.0/delete-extension.after.json",
            (document: Oas30Document) => {
                let extension: OasExtension = document.paths.pathItem("/").get.extension("x-existing-extension");
                return createDeleteExtensionCommand(document, extension);
            }
        );
    });

});

