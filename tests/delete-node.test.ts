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
import {DeleteNodeCommand_20, DeleteNodeCommand_30} from "../src/commands/delete-node.command";
import {Oas20Document, Oas30Document} from "oai-ts-core";


describe("Delete Node (2.0)", () => {

    it("Delete Node", () => {
        commandTest(
            "tests/fixtures/delete-node/2.0/delete-node.before.json",
            "tests/fixtures/delete-node/2.0/delete-node.after.json",
            (document: Oas20Document) => {
                return new DeleteNodeCommand_20("info", document);
            }
        );
    });

});


describe("Delete Node (3.0)", () => {

    it("Delete Node", () => {
        commandTest(
            "tests/fixtures/delete-node/3.0/delete-node.before.json",
            "tests/fixtures/delete-node/3.0/delete-node.after.json",
            (document: Oas30Document) => {
                return new DeleteNodeCommand_30("info", document);
            }
        );
    });

});
