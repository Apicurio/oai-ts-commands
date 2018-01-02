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
import {createChangeDescriptionCommand} from "../../src/commands/change-description.command";
import {Oas20Document, Oas30Document} from "oai-ts-core";


describe("Change Description (2.0)", () => {

    it("Add Description", () => {
        commandTest(
            "tests/_fixtures/commands/change-description/2.0/add-description.before.json",
            "tests/_fixtures/commands/change-description/2.0/add-description.after.json",
            (document: Oas20Document) => {
                return createChangeDescriptionCommand(document, "A description we added.");
            }
        );
    });

    it("Change Description", () => {
        commandTest(
            "tests/_fixtures/commands/change-description/2.0/change-description.before.json",
            "tests/_fixtures/commands/change-description/2.0/change-description.after.json",
            (document: Oas20Document) => {
                return createChangeDescriptionCommand(document, "An updated description.");
            }
        );
    });

});



describe("Change Description (3.0)", () => {

    it("Add Description", () => {
        commandTest(
            "tests/_fixtures/commands/change-description/3.0/add-description.before.json",
            "tests/_fixtures/commands/change-description/3.0/add-description.after.json",
            (document: Oas30Document) => {
                return createChangeDescriptionCommand(document, "A description we added.");
            }
        );
    });

    it("Change Description", () => {
        commandTest(
            "tests/_fixtures/commands/change-description/3.0/change-description.before.json",
            "tests/_fixtures/commands/change-description/3.0/change-description.after.json",
            (document: Oas30Document) => {
                return createChangeDescriptionCommand(document, "An updated description.");
            }
        );
    });

});
