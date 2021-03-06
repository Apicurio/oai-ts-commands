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
import {Oas20Document, Oas30Document} from "oai-ts-core";
import {createChangeTitleCommand} from "../../src/commands/change-title.command";


describe("Change Title (2.0)", () => {

    it("Add Title", () => {
        commandTest(
            "tests/_fixtures/commands/change-title/2.0/add-title.before.json",
            "tests/_fixtures/commands/change-title/2.0/add-title.after.json",
            (document: Oas20Document) => {
                return createChangeTitleCommand(document, "Swagger Sample App");
            }
        );
    });

    it("Change Title", () => {
        commandTest(
            "tests/_fixtures/commands/change-title/2.0/change-title.before.json",
            "tests/_fixtures/commands/change-title/2.0/change-title.after.json",
            (document: Oas20Document) => {
                return createChangeTitleCommand(document, "Updated Title");
            }
        );
    });

});



describe("Change Title (3.0)", () => {

    it("Add Title", () => {
        commandTest(
            "tests/_fixtures/commands/change-title/3.0/add-title.before.json",
            "tests/_fixtures/commands/change-title/3.0/add-title.after.json",
            (document: Oas30Document) => {
                return createChangeTitleCommand(document, "Sample Pet Store App");
            }
        );
    });

    it("Change Title", () => {
        commandTest(
            "tests/_fixtures/commands/change-title/3.0/change-title.before.json",
            "tests/_fixtures/commands/change-title/3.0/change-title.after.json",
            (document: Oas30Document) => {
                return createChangeTitleCommand(document, "Updated Title");
            }
        );
    });

});
