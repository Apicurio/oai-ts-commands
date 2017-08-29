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
import {Oas20Document, Oas20Operation, Oas20PathItem, Oas30Document, Oas30PathItem} from "oai-ts-core";
import {createReplacePathItemCommand} from "../src/commands/replace-path-item.command";


describe("Replace Path Item (2.0)", () => {

    it("Replace Path Item", () => {
        commandTest(
            "tests/fixtures/replace-path-item/2.0/replace-path-item.before.json",
            "tests/fixtures/replace-path-item/2.0/replace-path-item.after.json",
            (document: Oas20Document) => {
                let pathItem: Oas20PathItem = document.paths.pathItem("/pets") as Oas20PathItem;
                let newPathItem: Oas20PathItem = document.paths.createPathItem("/pets") as Oas20PathItem;
                newPathItem.put = newPathItem.createOperation("put");
                newPathItem.put.summary = "Update Pet";
                newPathItem.put.description = "Updates the pet.";
                newPathItem.put.operationId = "updatePet";
                (<Oas20Operation>newPathItem.put).consumes = ["application/json"];
                newPathItem.put.deprecated = false;
                return createReplacePathItemCommand(document, pathItem, newPathItem);
            }
        );
    });

});


describe("Replace Path Item (3.0)", () => {

    it("Replace Path Item", () => {
        commandTest(
            "tests/fixtures/replace-path-item/3.0/replace-path-item.before.json",
            "tests/fixtures/replace-path-item/3.0/replace-path-item.after.json",
            (document: Oas30Document) => {
                let pathItem: Oas30PathItem = document.paths.pathItem("/foo") as Oas30PathItem;
                let newPathItem: Oas30PathItem = document.paths.createPathItem("/foo") as Oas30PathItem;
                newPathItem.summary = "The Foo Resource";
                newPathItem.description = "Operations for Foos.";
                newPathItem.put = newPathItem.createOperation("put");
                newPathItem.put.tags = [ "tag1", "tag3" ];
                newPathItem.put.summary = "Update Pet";
                newPathItem.put.description = "Updates a pet.";
                newPathItem.put.operationId = "updatePet";
                newPathItem.put.deprecated = false;
                return createReplacePathItemCommand(document, pathItem, newPathItem);
            }
        );
    });

});

