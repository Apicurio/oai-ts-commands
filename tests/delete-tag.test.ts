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
import {Oas20Document, Oas30Document} from "oai-ts-core";
import {createDeleteTagCommand} from "../src/commands/delete-tag.command";


describe("Delete Tag (2.0)", () => {

    it("Delete Tag", () => {
        commandTest(
            "tests/fixtures/delete-tag/2.0/delete-tag.before.json",
            "tests/fixtures/delete-tag/2.0/delete-tag.after.json",
            (document: Oas20Document) => {
                return createDeleteTagCommand(document, "store");
            }
        );
    });

});


describe("Delete Tag (3.0)", () => {

    it("Delete Tag", () => {
        commandTest(
            "tests/fixtures/delete-tag/3.0/delete-tag.before.json",
            "tests/fixtures/delete-tag/3.0/delete-tag.after.json",
            (document: Oas30Document) => {
                return createDeleteTagCommand(document, "tag2");
            }
        );
    });

});

