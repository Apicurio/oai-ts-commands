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
import {createDeleteAllParametersCommand} from "../../src/commands/delete-all-parameters.command";


describe("Delete All Parameters (2.0)", () => {

    it("Delete All Parameters", () => {
        commandTest(
            "tests/_fixtures/commands/delete-all-parameters/2.0/delete-all-parameters.before.json",
            "tests/_fixtures/commands/delete-all-parameters/2.0/delete-all-parameters.after.json",
            (document: Oas20Document) => {
                let operation: Oas20Operation = document.paths.pathItem("/pet/{petId}").post as Oas20Operation;
                return createDeleteAllParametersCommand(document, operation, "formData");
            }
        );
    });

});


describe("Delete All Parameters (3.0)", () => {

    it("Delete All Parameters", () => {
        commandTest(
            "tests/_fixtures/commands/delete-all-parameters/3.0/delete-all-parameters.before.json",
            "tests/_fixtures/commands/delete-all-parameters/3.0/delete-all-parameters.after.json",
            (document: Oas30Document) => {
                let operation: Oas30Operation = document.paths.pathItem("/foo").get as Oas30Operation;
                return createDeleteAllParametersCommand(document, operation, "query");
            }
        );
    });

});

