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
import {
    NewSchemaDefinitionCommand_20,
    NewSchemaDefinitionCommand_30
} from "../src/commands/new-schema-definition.command";


describe("New Schema Definition (2.0)", () => {

    it("New Schema Definition", () => {
        commandTest(
            "tests/fixtures/new-schema-definition/2.0/new-schema-definition.before.json",
            "tests/fixtures/new-schema-definition/2.0/new-schema-definition.after.json",
            () => {
                return new NewSchemaDefinitionCommand_20("NewType");
            }
        );
    });

    it("New Schema Definition (Example)", () => {
        commandTest(
            "tests/fixtures/new-schema-definition/2.0/new-schema-definition-with-example.before.json",
            "tests/fixtures/new-schema-definition/2.0/new-schema-definition-with-example.after.json",
            () => {
                return new NewSchemaDefinitionCommand_20("NewType", {
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
            "tests/fixtures/new-schema-definition/3.0/new-schema-definition.before.json",
            "tests/fixtures/new-schema-definition/3.0/new-schema-definition.after.json",
            () => {
                return new NewSchemaDefinitionCommand_30("NewType");
            }
        );
    });

    it("New Schema Definition (Example)", () => {
        commandTest(
            "tests/fixtures/new-schema-definition/3.0/new-schema-definition-with-example.before.json",
            "tests/fixtures/new-schema-definition/3.0/new-schema-definition-with-example.after.json",
            () => {
                return new NewSchemaDefinitionCommand_30("NewType", {
                    "name": "Jason Bourne",
                    "age": 46,
                    "email": "jbourne@example.com",
                    "dob": "1971-04-15"
                });
            }
        );
    });
});

