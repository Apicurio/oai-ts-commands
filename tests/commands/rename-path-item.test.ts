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
import {createRenamePathItemCommand} from "../../src/commands/rename-path-item.command";
import {Oas20Document, Oas30Document} from "oai-ts-core";


describe("Rename Path Item (2.0)", () => {

    it("Rename Path", () => {
        commandTest(
            "tests/_fixtures/commands/rename-path-item/2.0/rename-path-item.before.json",
            "tests/_fixtures/commands/rename-path-item/2.0/rename-path-item.after.json",
            (document: Oas20Document) => {
                return createRenamePathItemCommand(document, "/pet/findByStatus", "/pet/searchByStatus");
            }
        );
    });

    it("Rename Path (With Params)", () => {
        commandTest(
            "tests/_fixtures/commands/rename-path-item/2.0/rename-path-item-with-params.before.json",
            "tests/_fixtures/commands/rename-path-item/2.0/rename-path-item-with-params.after.json",
            (document: Oas20Document) => {
                return createRenamePathItemCommand(document, "/examples/{exampleId}", "/foos/{fooId}");
            }
        );
    });

    it("Rename Path (With Sub-Paths)", () => {
        commandTest(
            "tests/_fixtures/commands/rename-path-item/2.0/rename-path-item-with-subPaths.before.json",
            "tests/_fixtures/commands/rename-path-item/2.0/rename-path-item-with-subPaths.after.json",
            (document: Oas20Document) => {
                return createRenamePathItemCommand(document, "/examples", "/samples");
            }
        );
    });

    it("Rename Path (With Both)", () => {
        commandTest(
            "tests/_fixtures/commands/rename-path-item/2.0/rename-path-item-with-both.before.json",
            "tests/_fixtures/commands/rename-path-item/2.0/rename-path-item-with-both.after.json",
            (document: Oas20Document) => {
                return createRenamePathItemCommand(document, "/examples/{exampleId}", "/samples/{sampleId}");
            }
        );
    });

});



describe("Rename Path Item (3.0)", () => {

    it("Rename Path", () => {
        commandTest(
            "tests/_fixtures/commands/rename-path-item/3.0/rename-path-item.before.json",
            "tests/_fixtures/commands/rename-path-item/3.0/rename-path-item.after.json",
            (document: Oas30Document) => {
                return createRenamePathItemCommand(document, "/v2", "/v3");
            }
        );
    });

    it("Rename Path (With Params)", () => {
        commandTest(
            "tests/_fixtures/commands/rename-path-item/3.0/rename-path-item-with-params.before.json",
            "tests/_fixtures/commands/rename-path-item/3.0/rename-path-item-with-params.after.json",
            (document: Oas30Document) => {
                return createRenamePathItemCommand(document, "/resources/{resId}/beers/{beerId}", "/resources/{resId}/foos/{fooId}");
            }
        );
    });

    it("Rename Path (With Sub-Paths)", () => {
        commandTest(
            "tests/_fixtures/commands/rename-path-item/3.0/rename-path-item-with-subPaths.before.json",
            "tests/_fixtures/commands/rename-path-item/3.0/rename-path-item-with-subPaths.after.json",
            (document: Oas30Document) => {
                return createRenamePathItemCommand(document, "/beers", "/brews");
            }
        );
    });

    it("Rename Path (With Both)", () => {
        commandTest(
            "tests/_fixtures/commands/rename-path-item/3.0/rename-path-item-with-both.before.json",
            "tests/_fixtures/commands/rename-path-item/3.0/rename-path-item-with-both.after.json",
            (document: Oas30Document) => {
                return createRenamePathItemCommand(document, "/beers/{beerId}", "/brews/{brewType}");
            }
        );
    });

});
