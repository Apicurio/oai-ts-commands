///<reference path="../../node_modules/@types/jasmine/index.d.ts"/>

/**
 * @license
 * Copyright 2019 JBoss Inc
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
import {createRenameTagDefinitionCommand} from "../../src/commands/rename-tag-definition.command";


describe("Rename Tag Definition (2.0)", () => {

    it("Rename Tag", () => {
        commandTest(
            "tests/_fixtures/commands/rename-tag-definition/2.0/rename-tag.before.json",
            "tests/_fixtures/commands/rename-tag-definition/2.0/rename-tag.after.json",
            () => {
                return createRenameTagDefinitionCommand("tag1", "newTag");
            }
        );
    });

    it("Refactor Tag", () => {
        commandTest(
            "tests/_fixtures/commands/rename-tag-definition/2.0/refactor-tag.before.json",
            "tests/_fixtures/commands/rename-tag-definition/2.0/refactor-tag.after.json",
            () => {
                return createRenameTagDefinitionCommand("tag1", "newTag");
            }
        );
    });

});



describe("Rename Tag Definition (3.0)", () => {

    it("Rename Tag", () => {
        commandTest(
            "tests/_fixtures/commands/rename-tag-definition/3.0/rename-tag.before.json",
            "tests/_fixtures/commands/rename-tag-definition/3.0/rename-tag.after.json",
            () => {
                return createRenameTagDefinitionCommand("tag1", "newTag");
            }
        );
    });

    it("Refactor Tag", () => {
        commandTest(
            "tests/_fixtures/commands/rename-tag-definition/3.0/refactor-tag.before.json",
            "tests/_fixtures/commands/rename-tag-definition/3.0/refactor-tag.after.json",
            () => {
                return createRenameTagDefinitionCommand("tag1", "newTag");
            }
        );
    });

});
