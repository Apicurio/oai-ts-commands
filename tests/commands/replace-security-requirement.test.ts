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
import {Oas30Document, OasSecurityRequirement} from "oai-ts-core";
import {createReplaceSecurityRequirementCommand} from "../../src/commands/replace-security-requirement.command";


describe("Replace Security Requirement (3.0)", () => {

    it("Replace Security Requirement (Document)", () => {
        commandTest(
            "tests/_fixtures/commands/replace-security-requirement/3.0/replace-security-requirement.before.json",
            "tests/_fixtures/commands/replace-security-requirement/3.0/replace-security-requirement.after.json",
            (document: Oas30Document) => {
                let _old: OasSecurityRequirement = document.security[1];
                let _new: OasSecurityRequirement = document.createSecurityRequirement();
                _new.addSecurityRequirementItem("BasicAuth");
                _new.addSecurityRequirementItem("MyOAuth", [ "read", "admin" ]);

                return createReplaceSecurityRequirementCommand(document, _old, _new);
            }
        );
    });

});
