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
import {Oas20Document, Oas20SchemaDefinition, Oas30Document, Oas30SchemaDefinition} from "oai-ts-core";
import {createReplaceSchemaDefinitionCommand} from "../src/commands/replace-schema-definition.command";


describe("Replace Schema Definition (2.0)", () => {

    it("Replace Schema Definition", () => {
        commandTest(
            "tests/fixtures/replace-schema-definition/2.0/replace-schema-definition.before.json",
            "tests/fixtures/replace-schema-definition/2.0/replace-schema-definition.after.json",
            (document: Oas20Document) => {
                let schemaDef: Oas20SchemaDefinition = document.definitions.definition("Person");
                let newSchemaDef: Oas20SchemaDefinition = document.definitions.createSchemaDefinition("Person");
                newSchemaDef.type = "object";
                newSchemaDef.discriminator = "petType";
                newSchemaDef.addProperty("name", newSchemaDef.createPropertySchema("name"));
                newSchemaDef.addProperty("petType", newSchemaDef.createPropertySchema("petType"));
                newSchemaDef.property("name").type = "string";
                newSchemaDef.property("petType").type = "string";
                newSchemaDef.required = [ "name", "petType" ];
                return createReplaceSchemaDefinitionCommand(document, schemaDef, newSchemaDef);
            }
        );
    });

});


describe("Replace Schema Definition (3.0)", () => {

    it("Replace Schema Definition", () => {
        commandTest(
            "tests/fixtures/replace-schema-definition/3.0/replace-schema-definition.before.json",
            "tests/fixtures/replace-schema-definition/3.0/replace-schema-definition.after.json",
            (document: Oas30Document) => {
                let schemaDef: Oas30SchemaDefinition = document.components.getSchemaDefinition("MySchema2");
                let newSchemaDef: Oas30SchemaDefinition = document.components.createSchemaDefinition("MySchema2");
                newSchemaDef.type = "object";
                newSchemaDef.addProperty("name", newSchemaDef.createPropertySchema("name"));
                newSchemaDef.addProperty("dob", newSchemaDef.createPropertySchema("dob"));
                newSchemaDef.property("name").type = "string";
                newSchemaDef.property("dob").type = "integer";
                newSchemaDef.property("dob").format = "int32";
                newSchemaDef.required = [ "name" ];
                return createReplaceSchemaDefinitionCommand(document, schemaDef, newSchemaDef);
            }
        );
    });

});

