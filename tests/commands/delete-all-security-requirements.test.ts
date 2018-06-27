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
import {Oas20Document, Oas30Document, OasDocument, OasOperation, OasSecurityRequirement} from "oai-ts-core";
import {createDeleteAllSecurityRequirementsCommand} from "../../src/commands/delete-all-security-requirements.command";


describe("Delete All Security Requirements (2.0)", () => {

    it("Delete All Security Requirements (Operation)", () => {
        commandTest(
            "tests/_fixtures/commands/delete-all-security-requirements/2.0/delete-all-security-requirements.before.json",
            "tests/_fixtures/commands/delete-all-security-requirements/2.0/delete-all-security-requirements.after.json",
            (document: Oas20Document) => {
                let parent: OasOperation = document.paths.pathItem("/pet").post;
                return createDeleteAllSecurityRequirementsCommand(parent);
            }
        );
    });

});



describe("Delete All Security Requirements (3.0)", () => {

    it("Delete All Security Requirements (Document)", () => {
        commandTest(
            "tests/_fixtures/commands/delete-all-security-requirements/3.0/delete-all-security-requirements.before.json",
            "tests/_fixtures/commands/delete-all-security-requirements/3.0/delete-all-security-requirements.after.json",
            (document: Oas30Document) => {
                let parent: OasDocument = document;
                return createDeleteAllSecurityRequirementsCommand(parent);
            }
        );
    });

    it("Delete All Security Requirements (Operation)", () => {
        commandTest(
            "tests/_fixtures/commands/delete-all-security-requirements/3.0/delete-all-security-requirements-op.before.json",
            "tests/_fixtures/commands/delete-all-security-requirements/3.0/delete-all-security-requirements-op.after.json",
            (document: Oas30Document) => {
                let parent: OasOperation = document.paths.pathItem("/").get;
                return createDeleteAllSecurityRequirementsCommand(parent);
            }
        );
    });

});

