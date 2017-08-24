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
import {ChangeVersionCommand_20, ChangeVersionCommand_30} from "../src/commands/change-version.command";


describe("Change Version (2.0)", () => {

    it("Add Version", () => {
        commandTest(
            "tests/fixtures/change-version/2.0/add-version.before.json",
            "tests/fixtures/change-version/2.0/add-version.after.json",
            () => {
                return new ChangeVersionCommand_20("1.0.1");
            }
        );
    });

    it("Change Version", () => {
        commandTest(
            "tests/fixtures/change-version/2.0/change-version.before.json",
            "tests/fixtures/change-version/2.0/change-version.after.json",
            () => {
                return new ChangeVersionCommand_20("2.3.7");
            }
        );
    });

});



describe("Change Version (3.0)", () => {

    it("Add Version", () => {
        commandTest(
            "tests/fixtures/change-version/3.0/add-version.before.json",
            "tests/fixtures/change-version/3.0/add-version.after.json",
            () => {
                return new ChangeVersionCommand_30("1.0.1");
            }
        );
    });

    it("Change Version", () => {
        commandTest(
            "tests/fixtures/change-version/3.0/change-version.before.json",
            "tests/fixtures/change-version/3.0/change-version.after.json",
            () => {
                return new ChangeVersionCommand_30("2.3.7");
            }
        );
    });

});
