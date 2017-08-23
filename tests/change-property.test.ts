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
import {ChangePropertyCommand_20, ChangePropertyCommand_30} from "../src/commands/change-property.command";
import {Oas20Document, Oas30Document} from "oai-ts-core";


describe("Change Property (2.0)", () => {

    it("Add Property", () => {
        commandTest(
            "tests/fixtures/change-property/2.0/add-property.before.json",
            "tests/fixtures/change-property/2.0/add-property.after.json",
            (document: Oas20Document) => {
                return new ChangePropertyCommand_20<string>(document, "host", "example.org");
            }
        );
    });

    it("Change Property", () => {
        commandTest(
            "tests/fixtures/change-property/2.0/change-property.before.json",
            "tests/fixtures/change-property/2.0/change-property.after.json",
            (document: Oas20Document) => {
                return new ChangePropertyCommand_20<string>(document, "host", "updated.example.org");
            }
        );
    });

});


describe("Change Property (3.0)", () => {

    it("Add Property", () => {
        commandTest(
            "tests/fixtures/change-property/3.0/add-property.before.json",
            "tests/fixtures/change-property/3.0/add-property.after.json",
            (document: Oas30Document) => {
                return new ChangePropertyCommand_30<string>(document.info, "termsOfService", "http://example.com/terms/");
            }
        );
    });

    it("Change Property", () => {
        commandTest(
            "tests/fixtures/change-property/3.0/change-property.before.json",
            "tests/fixtures/change-property/3.0/change-property.after.json",
            (document: Oas30Document) => {
                return new ChangePropertyCommand_30<string>(document.info, "termsOfService", "http://example.com/updated-terms/");
            }
        );
    });

});
