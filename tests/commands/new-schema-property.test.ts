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
import {createNewSchemaPropertyCommand} from "../../src/commands/new-schema-property.command";
import {Oas20Document, Oas30Document} from "oai-ts-core";
import {SimplifiedPropertyType, SimplifiedType} from "../../src/models/simplified-type.model";


describe("New Schema Property (2.0)", () => {

    it("New Schema Property", () => {
        commandTest(
            "tests/_fixtures/commands/new-schema-property/2.0/new-schema-property.before.json",
            "tests/_fixtures/commands/new-schema-property/2.0/new-schema-property.after.json",
            (document: Oas20Document) => {
                return createNewSchemaPropertyCommand(document, document.definitions.definition("Person"), "newProperty");
            }
        );
    });

    it("New Schema Property (Description)", () => {
        commandTest(
            "tests/_fixtures/commands/new-schema-property/2.0/new-schema-property-description.before.json",
            "tests/_fixtures/commands/new-schema-property/2.0/new-schema-property-description.after.json",
            (document: Oas20Document) => {
                return createNewSchemaPropertyCommand(document, document.definitions.definition("Person"),
                    "newProperty", "Hello world.");
            }
        );
    });

    it("New Schema Property (Type)", () => {
        commandTest(
            "tests/_fixtures/commands/new-schema-property/2.0/new-schema-property-type.before.json",
            "tests/_fixtures/commands/new-schema-property/2.0/new-schema-property-type.after.json",
            (document: Oas20Document) => {
                let newType: SimplifiedPropertyType = new SimplifiedPropertyType();
                newType.type = "array";
                newType.of = new SimplifiedType();
                newType.of.type = "string";
                newType.required = true;
                return createNewSchemaPropertyCommand(document, document.definitions.definition("Person"),
                    "newProperty", null, newType);
            }
        );
    });

});


describe("New Schema Property (3.0)", () => {

    it("New Schema Property", () => {
        commandTest(
            "tests/_fixtures/commands/new-schema-property/3.0/new-schema-property.before.json",
            "tests/_fixtures/commands/new-schema-property/3.0/new-schema-property.after.json",
            (document: Oas30Document) => {
                return createNewSchemaPropertyCommand(document, document.components.getSchemaDefinition("MySchema1"), "newProperty");
            }
        );
    });

    it("New Schema Property (Both)", () => {
        commandTest(
            "tests/_fixtures/commands/new-schema-property/3.0/new-schema-property-both.before.json",
            "tests/_fixtures/commands/new-schema-property/3.0/new-schema-property-both.after.json",
            (document: Oas30Document) => {
                let newType: SimplifiedPropertyType = new SimplifiedPropertyType();
                newType.type = "array";
                newType.of = new SimplifiedType();
                newType.of.type = "string";
                newType.of.as = "date-time";
                newType.required = true;
                return createNewSchemaPropertyCommand(document, document.components.getSchemaDefinition("MySchema1"),
                    "newProperty", "Hello 3.0 world.", newType);
            }
        );
    });

});

