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
    DeleteAllPropertiesCommand_20,
    DeleteAllPropertiesCommand_30
} from "../src/commands/delete-all-properties.command";
import {Oas20Document, Oas20SchemaDefinition, Oas30Document, Oas30SchemaDefinition} from "oai-ts-core";


describe("Delete All Properties (2.0)", () => {

    it("Delete All Properties", () => {
        commandTest(
            "tests/fixtures/delete-all-properties/2.0/delete-all-properties.before.json",
            "tests/fixtures/delete-all-properties/2.0/delete-all-properties.after.json",
            (document: Oas20Document) => {
                let schema: Oas20SchemaDefinition = document.definitions.definition("Order");
                return new DeleteAllPropertiesCommand_20(schema);
            }
        );
    });

});


describe("Delete All Properties (3.0)", () => {

    it("Delete All Properties", () => {
        commandTest(
            "tests/fixtures/delete-all-properties/3.0/delete-all-properties.before.json",
            "tests/fixtures/delete-all-properties/3.0/delete-all-properties.after.json",
            (document: Oas30Document) => {
                let schema: Oas30SchemaDefinition = document.components.getSchemaDefinition("MySchema1");
                return new DeleteAllPropertiesCommand_30(schema);
            }
        );
    });

});

