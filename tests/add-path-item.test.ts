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

import {Oas20Document, Oas30Document, OasLibraryUtils} from "oai-ts-core";
import {commandTest} from "./_test-utils";
import {AddPathItemCommand_20, AddPathItemCommand_30, createAddPathItemCommand} from "../src/commands/add-path.command";


describe("Add Path Item (2.0)", () => {

    let library: OasLibraryUtils = new OasLibraryUtils();

    it("Clone Path Item", () => {
        commandTest(
            "tests/fixtures/add-path-item/2.0/clone-path-item.before.json",
            "tests/fixtures/add-path-item/2.0/clone-path-item.after.json",
            (document: Oas20Document) => {
                let pathItemObj: any = library.writeNode(document.paths.pathItem("/pets"));
                return createAddPathItemCommand(document, "/clonedPets", pathItemObj);
            }
        );
    });

    it("Add Path Item", () => {
        commandTest(
            "tests/fixtures/add-path-item/2.0/add-path-item.before.json",
            "tests/fixtures/add-path-item/2.0/add-path-item.after.json",
            (document: Oas20Document) => {
                return createAddPathItemCommand(document, "/newPath", {});
            }
        );
    });

});


describe("Add Path Item (3.0)", () => {

    let library: OasLibraryUtils = new OasLibraryUtils();

    it("Clone Path Item", () => {
        commandTest(
            "tests/fixtures/add-path-item/3.0/clone-path-item.before.json",
            "tests/fixtures/add-path-item/3.0/clone-path-item.after.json",
            (document: Oas30Document) => {
                let defObj: any = library.writeNode(document.paths.pathItem("/foo"));
                return createAddPathItemCommand(document, "/clonedFoo", defObj);
            }
        );
    });

    it("Add Path Item", () => {
        commandTest(
            "tests/fixtures/add-path-item/3.0/add-path-item.before.json",
            "tests/fixtures/add-path-item/3.0/add-path-item.after.json",
            (document: Oas30Document) => {
                return createAddPathItemCommand(document, "/newPath", {});
            }
        );
    });

});
