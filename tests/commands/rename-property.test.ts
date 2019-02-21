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
import {createRenamePropertyCommand} from "../../src/commands/rename-property.command";
import {Oas20Document, Oas30Document, OasSchema} from "oai-ts-core";


describe("Rename Schema Property (2.0)", () => {

    it("Rename Property", () => {
        commandTest(
            "tests/_fixtures/commands/rename-property/2.0/rename-property.before.json",
            "tests/_fixtures/commands/rename-property/2.0/rename-property.after.json",
            (doc: Oas20Document) => {
                let schema: OasSchema = doc.definitions.definition("Person");
                return createRenamePropertyCommand(schema, "name", "newName");
            }
        );
    });

});



describe("Rename Tag Definition (3.0)", () => {

    it("Rename Property", () => {
        commandTest(
            "tests/_fixtures/commands/rename-property/3.0/rename-property.before.json",
            "tests/_fixtures/commands/rename-property/3.0/rename-property.after.json",
            (doc: Oas30Document) => {
                let schema: OasSchema = doc.components.getSchemaDefinition("MySchema1");
                return createRenamePropertyCommand(schema, "name", "newName");
            }
        );
    });

});
