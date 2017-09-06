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
import {Oas30Document, Oas30MediaType, Oas30Operation, Oas30Response} from "oai-ts-core";
import {createDeleteMediaTypeCommand} from "../src/commands/delete-media-type.command";


describe("Delete Media Type (3.0)", () => {

    it("Delete Media Type (Request Body)", () => {
        commandTest(
            "tests/fixtures/delete-media-type/3.0/delete-media-type-requestBody.before.json",
            "tests/fixtures/delete-media-type/3.0/delete-media-type-requestBody.after.json",
            (document: Oas30Document) => {
                let operation: Oas30Operation = document.paths.pathItem("/foo").get as Oas30Operation;
                let mediaType: Oas30MediaType = operation.requestBody.getMediaType("multipart/mixed");
                return createDeleteMediaTypeCommand(document, mediaType);
            }
        );
    });

    it("Delete Media Type (Response)", () => {
        commandTest(
            "tests/fixtures/delete-media-type/3.0/delete-media-type-response.before.json",
            "tests/fixtures/delete-media-type/3.0/delete-media-type-response.after.json",
            (document: Oas30Document) => {
                let operation: Oas30Operation = document.paths.pathItem("/foo").get as Oas30Operation;
                let response: Oas30Response = operation.responses.response("200") as Oas30Response;
                let mediaType: Oas30MediaType = response.getMediaType("application/json");
                return createDeleteMediaTypeCommand(document, mediaType);
            }
        );
    });

});

