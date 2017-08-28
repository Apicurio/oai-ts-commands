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
import {NewPathCommand_20, NewPathCommand_30} from "../src/commands/new-path.command";


describe("New Path (2.0)", () => {

    it("New Path", () => {
        commandTest(
            "tests/fixtures/new-path/2.0/new-path.before.json",
            "tests/fixtures/new-path/2.0/new-path.after.json",
            () => {
                return new NewPathCommand_20("/newPath");
            }
        );
    });

});


describe("New Path (3.0)", () => {

    it("New Path", () => {
        commandTest(
            "tests/fixtures/new-path/3.0/new-path.before.json",
            "tests/fixtures/new-path/3.0/new-path.after.json",
            () => {
                return new NewPathCommand_30("/newPath");
            }
        );
    });

});

