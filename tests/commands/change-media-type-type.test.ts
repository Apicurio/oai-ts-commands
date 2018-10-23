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
import {Oas30Document, Oas30Response} from "oai-ts-core";
import {createChangeMediaTypeTypeCommand} from "../../src/commands/change-media-type-type.command";
import {SimplifiedType} from "../../src/models/simplified-type.model";


describe("Change Media Type (3.0)", () => {

    it("Change Media Type (Response)", () => {
        commandTest(
            "tests/_fixtures/commands/change-media-type-type/3.0/change-media-type-type-response.before.json",
            "tests/_fixtures/commands/change-media-type-type/3.0/change-media-type-type-response.after.json",
            (document: Oas30Document) => {
                let response: Oas30Response = document.paths.pathItem("/foo").get.responses.response("200") as Oas30Response;
                let newType: SimplifiedType = new SimplifiedType();
                newType.type = "string";
                newType.as = "date";
                return createChangeMediaTypeTypeCommand(document, response.getMediaType("application/json"), newType);
            }
        );
    });

    it("Change Media Type (Enum)", () => {
        commandTest(
            "tests/_fixtures/commands/change-media-type-type/3.0/change-media-type-type-enum.before.json",
            "tests/_fixtures/commands/change-media-type-type/3.0/change-media-type-type-enum.after.json",
            (document: Oas30Document) => {
                let response: Oas30Response = document.paths.pathItem("/foo").get.responses.response("200") as Oas30Response;
                let newType: SimplifiedType = new SimplifiedType();
                newType.type = "string";
                newType.enum = [ "option1", "option2", "option3" ];
                return createChangeMediaTypeTypeCommand(document, response.getMediaType("application/json"), newType);
            }
        );
    });

});

