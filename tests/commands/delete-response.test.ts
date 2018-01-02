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
import {Oas20Document, Oas20Response, Oas30Document, Oas30Response} from "oai-ts-core";
import {createDeleteResponseCommand} from "../../src/commands/delete-response.command";


describe("Delete Response (2.0)", () => {

    it("Delete Response", () => {
        commandTest(
            "tests/_fixtures/commands/delete-response/2.0/delete-response.before.json",
            "tests/_fixtures/commands/delete-response/2.0/delete-response.after.json",
            (document: Oas20Document) => {
                let response: Oas20Response = document.paths.pathItem("/pet").post.responses.response("405") as Oas20Response;
                return createDeleteResponseCommand(document, response);
            }
        );
    });

});


describe("Delete Response (3.0)", () => {

    it("Delete Response", () => {
        commandTest(
            "tests/_fixtures/commands/delete-response/3.0/delete-response.before.json",
            "tests/_fixtures/commands/delete-response/3.0/delete-response.after.json",
            (document: Oas30Document) => {
                let response: Oas30Response = document.paths.pathItem("/foo").get.responses.response("200") as Oas30Response;
                return createDeleteResponseCommand(document, response);
            }
        );
    });

});


