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
import {createDeleteAllTagsCommand} from "../../src/commands/delete-all-tags.command";


describe("Delete All Tags (2.0)", () => {

    it("Delete All Tags", () => {
        commandTest(
            "tests/_fixtures/commands/delete-all-tags/2.0/delete-all-tags.before.json",
            "tests/_fixtures/commands/delete-all-tags/2.0/delete-all-tags.after.json",
            () => {
                return createDeleteAllTagsCommand();
            }
        );
    });

});


describe("Delete All Tags (3.0)", () => {

    it("Delete All Tags", () => {
        commandTest(
            "tests/_fixtures/commands/delete-all-tags/3.0/delete-all-tags.before.json",
            "tests/_fixtures/commands/delete-all-tags/3.0/delete-all-tags.after.json",
            () => {
                return createDeleteAllTagsCommand();
            }
        );
    });

});

