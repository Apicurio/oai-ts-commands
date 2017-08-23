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
import {ChangeLicenseCommand_20, ChangeLicenseCommand_30} from "../src/commands/change-license.command";


describe("Change License (2.0)", () => {

    it("Add License", () => {
        commandTest(
            "tests/fixtures/change-license/2.0/add-license.before.json",
            "tests/fixtures/change-license/2.0/add-license.after.json",
            () => {
                return new ChangeLicenseCommand_20("Apache 2.0", "http://www.apache.org/licenses/LICENSE-2.0.html");
            }
        );
    });

    it("Change License", () => {
        commandTest(
            "tests/fixtures/change-license/2.0/change-license.before.json",
            "tests/fixtures/change-license/2.0/change-license.after.json",
            () => {
                return new ChangeLicenseCommand_20("Apache 2.0", "http://www.apache.org/licenses/LICENSE-2.0.html");
            }
        );
    });

});


describe("Change License (3.0)", () => {

    it("Add License", () => {
        commandTest(
            "tests/fixtures/change-license/3.0/add-license.before.json",
            "tests/fixtures/change-license/3.0/add-license.after.json",
            () => {
                return new ChangeLicenseCommand_30("Apache 2.0", "http://www.apache.org/licenses/LICENSE-2.0.html");
            }
        );
    });

    it("Change License", () => {
        commandTest(
            "tests/fixtures/change-license/3.0/change-license.before.json",
            "tests/fixtures/change-license/3.0/change-license.after.json",
            () => {
                return new ChangeLicenseCommand_30("Apache 2.0", "http://www.apache.org/licenses/LICENSE-2.0.html");
            }
        );
    });

});
