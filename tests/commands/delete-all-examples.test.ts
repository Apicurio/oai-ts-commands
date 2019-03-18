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
import {Oas30Document, Oas30MediaType} from "oai-ts-core";
import {createDeleteAllExamplesCommand} from "../../src/commands/delete-all-examples.command";

describe("Delete All Examples (3.0)", () => {

    it("should delete all examples", () => {
        commandTest(
            "tests/_fixtures/commands/delete-all-examples/3.0/delete-all-examples.before.json",
            "tests/_fixtures/commands/delete-all-examples/3.0/delete-all-examples.after.json",
            (document: Oas30Document) => {
                let mediaType: Oas30MediaType = document.paths.pathItem("/").get.responses.response("500")["content"]["application/json"];
                return createDeleteAllExamplesCommand(document, mediaType);
            }
        );
    });

});
