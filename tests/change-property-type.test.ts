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
import {createChangePropertyTypeCommand} from "../src/commands/change-property-type.command";
import {SimplifiedType} from "../src/models/simplified-type.model";
import {Oas20Document, Oas20PropertySchema, Oas30Document, Oas30PropertySchema,} from "oai-ts-core";


describe("Change Property Type (2.0)", () => {

    it("Change Property Type", () => {
        commandTest(
            "tests/fixtures/change-property-type/2.0/change-property-type.before.json",
            "tests/fixtures/change-property-type/2.0/change-property-type.after.json",
            (document: Oas20Document) => {
                let property: Oas20PropertySchema = document.definitions.definition("Person").property("id") as Oas20PropertySchema;
                let type: SimplifiedType = new SimplifiedType();
                type.type = "string";
                type.as = "date-time";
                return createChangePropertyTypeCommand(document, property, type);
            }
        );
    });

});


describe("Change Property Type (3.0)", () => {

    it("Change Property Type", () => {
        commandTest(
            "tests/fixtures/change-property-type/3.0/change-property-type.before.json",
            "tests/fixtures/change-property-type/3.0/change-property-type.after.json",
            (document: Oas30Document) => {
                let property: Oas30PropertySchema = document.components.getSchemaDefinition("MySchema1").property("name") as Oas30PropertySchema;
                let type: SimplifiedType = new SimplifiedType();
                type.type = "integer";
                type.as = "int32";
                return createChangePropertyTypeCommand(document, property, type);
            }
        );
    });

});
