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
import {ChangeDescriptionCommand_20, ChangeDescriptionCommand_30} from "../src/commands/change-description.command";


describe("Change Description (2.0)", () => {

    it("Add Description", () => {
        commandTest(
            "tests/fixtures/change-description/2.0/add-description.before.json",
            "tests/fixtures/change-description/2.0/add-description.after.json",
            () => {
                return new ChangeDescriptionCommand_20("A description we added.");
            }
        );
    });

    it("Change Description", () => {
        commandTest(
            "tests/fixtures/change-description/2.0/change-description.before.json",
            "tests/fixtures/change-description/2.0/change-description.after.json",
            () => {
                return new ChangeDescriptionCommand_20("An updated description.");
            }
        );
    });

});



describe("Change Description (3.0)", () => {

    it("Add Description", () => {
        commandTest(
            "tests/fixtures/change-description/3.0/add-description.before.json",
            "tests/fixtures/change-description/3.0/add-description.after.json",
            () => {
                return new ChangeDescriptionCommand_30("A description we added.");
            }
        );
    });

    it("Change Description", () => {
        commandTest(
            "tests/fixtures/change-description/3.0/change-description.before.json",
            "tests/fixtures/change-description/3.0/change-description.after.json",
            () => {
                return new ChangeDescriptionCommand_30("An updated description.");
            }
        );
    });

});
