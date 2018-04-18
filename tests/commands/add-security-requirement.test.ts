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
import {createAddSecurityRequirementCommand} from "../../src/commands/add-security-requirement.command";


describe("Add Security Requirement (2.0)", () => {

    it("Add Security Requirement", () => {
        commandTest(
            "tests/_fixtures/commands/add-security-requirement/2.0/add-security-requirement.before.json",
            "tests/_fixtures/commands/add-security-requirement/2.0/add-security-requirement.after.json",
            (document: Oas20Document) => {
                let parent: OasDocument = document;
                let requirement: OasSecurityRequirement = parent.createSecurityRequirement();
                requirement.addSecurityRequirementItem("Auth1", []);
                requirement.addSecurityRequirementItem("Auth2", [ "s1", "s2", "s3" ]);
                return createAddSecurityRequirementCommand(document, parent, requirement);
            }
        );
    });

});


describe("Add Security Requirement (3.0)", () => {

    it("Add Security Requirement (Document)", () => {
        commandTest(
            "tests/_fixtures/commands/add-security-requirement/3.0/add-security-requirement.before.json",
            "tests/_fixtures/commands/add-security-requirement/3.0/add-security-requirement.after.json",
            (document: Oas30Document) => {
                let parent: OasDocument = document;
                let requirement: OasSecurityRequirement = parent.createSecurityRequirement();
                requirement.addSecurityRequirementItem("Auth1", []);
                requirement.addSecurityRequirementItem("Auth2", [ "s1", "s2", "s3" ]);
                return createAddSecurityRequirementCommand(document, parent, requirement);
            }
        );
    });

    it("Add Security Requirement (Document 2)", () => {
        commandTest(
            "tests/_fixtures/commands/add-security-requirement/3.0/add-security-requirement-doc2.before.json",
            "tests/_fixtures/commands/add-security-requirement/3.0/add-security-requirement-doc2.after.json",
            (document: Oas30Document) => {
                let parent: OasDocument = document;
                let requirement: OasSecurityRequirement = parent.createSecurityRequirement();
                requirement.addSecurityRequirementItem("Auth1", []);
                requirement.addSecurityRequirementItem("Auth2", [ "s1", "s2", "s3" ]);
                return createAddSecurityRequirementCommand(document, parent, requirement);
            }
        );
    });

    it("Add Security Requirement (Operation)", () => {
        commandTest(
            "tests/_fixtures/commands/add-security-requirement/3.0/add-security-requirement-op.before.json",
            "tests/_fixtures/commands/add-security-requirement/3.0/add-security-requirement-op.after.json",
            (document: Oas30Document) => {
                let parent: OasOperation = document.paths.pathItem("/").get;
                let requirement: OasSecurityRequirement = parent.createSecurityRequirement();
                requirement.addSecurityRequirementItem("Auth1", []);
                requirement.addSecurityRequirementItem("Auth2", [ "s1", "s2", "s3" ]);
                return createAddSecurityRequirementCommand(document, parent, requirement);
            }
        );
    });

});
