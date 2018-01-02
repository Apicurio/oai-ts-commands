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
import {Oas20Document, Oas20Operation, Oas30Document, Oas30Operation} from "oai-ts-core";
import {createNewRequestBodyCommand} from "../../src/commands/new-request-body.command";


describe("New Request Body (2.0)", () => {

    it("New Request Body", () => {
        commandTest(
            "tests/_fixtures/commands/new-request-body/2.0/new-request-body.before.json",
            "tests/_fixtures/commands/new-request-body/2.0/new-request-body.after.json",
            (document: Oas20Document) => {
                return createNewRequestBodyCommand(document, document.paths.pathItem("/pets").get as Oas20Operation);
            }
        );
    });

});


describe("New Request Body (3.0)", () => {

    it("New Request Body", () => {
        commandTest(
            "tests/_fixtures/commands/new-request-body/3.0/new-request-body.before.json",
            "tests/_fixtures/commands/new-request-body/3.0/new-request-body.after.json",
            (document: Oas30Document) => {
                return createNewRequestBodyCommand(document, document.paths.pathItem("/foo").get as Oas30Operation);
            }
        );
    });

});

