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
import {createRenameSchemaDefinitionCommand} from "../../src/commands/rename-schema-definition.command";
import {Oas20Document, Oas30Document} from "oai-ts-core";


describe("Rename Schema Definition (2.0)", () => {

    it("Rename Definition", () => {
        commandTest(
            "tests/_fixtures/commands/rename-schema-definition/2.0/rename-schema-definition.before.json",
            "tests/_fixtures/commands/rename-schema-definition/2.0/rename-schema-definition.after.json",
            (document: Oas20Document) => {
                return createRenameSchemaDefinitionCommand(document, "Pet", "Kangaroo");
            }
        );
    });

});



describe("Rename Schema Definition (3.0)", () => {

    it("Rename Definition", () => {
        commandTest(
            "tests/_fixtures/commands/rename-schema-definition/3.0/rename-schema-definition.before.json",
            "tests/_fixtures/commands/rename-schema-definition/3.0/rename-schema-definition.after.json",
            (document: Oas30Document) => {
                return createRenameSchemaDefinitionCommand(document, "User", "Dude");
            }
        );
    });

});
