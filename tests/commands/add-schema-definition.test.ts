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

import {Oas20Document, Oas30Document, OasLibraryUtils} from "oai-ts-core";
import {commandTest} from "./_test-utils";
import {createAddSchemaDefinitionCommand} from "../../src/commands/add-schema-definition.command";


describe("Add Definition (2.0)", () => {

    let library: OasLibraryUtils = new OasLibraryUtils();

    it("Clone Definition", () => {
        commandTest(
            "tests/_fixtures/commands/add-definition/2.0/clone-definition.before.json",
            "tests/_fixtures/commands/add-definition/2.0/clone-definition.after.json",
            (document: Oas20Document) => {
                let defObj: any = library.writeNode(document.definitions.definition("Category"));
                return createAddSchemaDefinitionCommand(document, "CategoryClone", defObj);
            }
        );
    });

    it("Add Definition", () => {
        commandTest(
            "tests/_fixtures/commands/add-definition/2.0/add-definition.before.json",
            "tests/_fixtures/commands/add-definition/2.0/add-definition.after.json",
            (document: Oas20Document) => {
                return createAddSchemaDefinitionCommand(document,"Empty", {});
            }
        );
    });

});


describe("Add Schema Definition (3.0)", () => {

    let library: OasLibraryUtils = new OasLibraryUtils();

    it("Clone Definition", () => {
        commandTest(
            "tests/_fixtures/commands/add-definition/3.0/clone-definition.before.json",
            "tests/_fixtures/commands/add-definition/3.0/clone-definition.after.json",
            (document: Oas30Document) => {
                let defObj: any = library.writeNode(document.components.getSchemaDefinition("MySchema1"));
                return createAddSchemaDefinitionCommand(document,"ClonedSchema", defObj);
            }
        );
    });

    it("Add Definition", () => {
        commandTest(
            "tests/_fixtures/commands/add-definition/3.0/add-definition.before.json",
            "tests/_fixtures/commands/add-definition/3.0/add-definition.after.json",
            (document: Oas30Document) => {
                return createAddSchemaDefinitionCommand(document,"EmptySchema", {});
            }
        );
    });

});
