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
import {ChangeTitleCommand_20, ChangeTitleCommand_30} from "../src/commands/change-title.command";


describe("Change Title (2.0)", () => {

    it("Add Title", () => {
        commandTest(
            "tests/fixtures/change-title/2.0/add-title.before.json",
            "tests/fixtures/change-title/2.0/add-title.after.json",
            () => {
                return new ChangeTitleCommand_20("Swagger Sample App");
            }
        );
    });

    it("Change Title", () => {
        commandTest(
            "tests/fixtures/change-title/2.0/change-title.before.json",
            "tests/fixtures/change-title/2.0/change-title.after.json",
            () => {
                return new ChangeTitleCommand_20("Updated Title");
            }
        );
    });

});



describe("Change Title (3.0)", () => {

    it("Add Title", () => {
        commandTest(
            "tests/fixtures/change-title/3.0/add-title.before.json",
            "tests/fixtures/change-title/3.0/add-title.after.json",
            () => {
                return new ChangeTitleCommand_30("Sample Pet Store App");
            }
        );
    });

    it("Change Title", () => {
        commandTest(
            "tests/fixtures/change-title/3.0/change-title.before.json",
            "tests/fixtures/change-title/3.0/change-title.after.json",
            () => {
                return new ChangeTitleCommand_30("Updated Title");
            }
        );
    });

});
