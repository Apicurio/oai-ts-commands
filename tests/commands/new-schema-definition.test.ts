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
import {Oas20Document, Oas30Document} from "oai-ts-core";
import {createNewSchemaDefinitionCommand} from "../../src/commands/new-schema-definition.command";


describe("New Schema Definition (2.0)", () => {

    it("New Schema Definition", () => {
        commandTest(
            "tests/_fixtures/commands/new-schema-definition/2.0/new-schema-definition.before.json",
            "tests/_fixtures/commands/new-schema-definition/2.0/new-schema-definition.after.json",
            (document: Oas20Document) => {
                return createNewSchemaDefinitionCommand(document, "NewType");
            }
        );
    });

    it("New Schema Definition (Example)", () => {
        commandTest(
            "tests/_fixtures/commands/new-schema-definition/2.0/new-schema-definition-with-example.before.json",
            "tests/_fixtures/commands/new-schema-definition/2.0/new-schema-definition-with-example.after.json",
            (document: Oas20Document) => {
                return createNewSchemaDefinitionCommand(document, "NewType", {
                    "name": "Jason Bourne",
                    "age": 46,
                    "email": "jbourne@example.com",
                    "dob": "1971-04-15"
                });
            }
        );
    });
});


describe("New Schema Definition (3.0)", () => {

    it("New Schema Definition", () => {
        commandTest(
            "tests/_fixtures/commands/new-schema-definition/3.0/new-schema-definition.before.json",
            "tests/_fixtures/commands/new-schema-definition/3.0/new-schema-definition.after.json",
            (document: Oas30Document) => {
                return createNewSchemaDefinitionCommand(document, "NewType");
            }
        );
    });

    it("New Schema Definition (Example)", () => {
        commandTest(
            "tests/_fixtures/commands/new-schema-definition/3.0/new-schema-definition-with-example.before.json",
            "tests/_fixtures/commands/new-schema-definition/3.0/new-schema-definition-with-example.after.json",
            (document: Oas30Document) => {
                return createNewSchemaDefinitionCommand(document, "NewType", {
                    "name": "Jason Bourne",
                    "age": 46,
                    "email": "jbourne@example.com",
                    "dob": "1971-04-15"
                });
            }
        );
    });
});

