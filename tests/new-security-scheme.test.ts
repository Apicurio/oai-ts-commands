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
import {Oas20Document, Oas20SecurityScheme, Oas30Document, Oas30SecurityScheme} from "oai-ts-core";
import {createNewSecuritySchemeCommand} from "../src/commands/new-security-scheme.command";


describe("New Security Scheme (2.0)", () => {

    it("New Security Scheme", () => {
        commandTest(
            "tests/fixtures/new-security-scheme/2.0/new-security-scheme.before.json",
            "tests/fixtures/new-security-scheme/2.0/new-security-scheme.after.json",
            (document: Oas20Document) => {
                let newScheme: Oas20SecurityScheme = document.securityDefinitions.createSecurityScheme("new_scheme");
                newScheme.type = "apiKey";
                newScheme.name = "key";
                newScheme.in = "header";
                return createNewSecuritySchemeCommand(document, newScheme);
            }
        );
    });

});


describe("New Security Scheme (3.0)", () => {

    it("New Security Scheme", () => {
        commandTest(
            "tests/fixtures/new-security-scheme/3.0/new-security-scheme.before.json",
            "tests/fixtures/new-security-scheme/3.0/new-security-scheme.after.json",
            (document: Oas30Document) => {
                let newScheme: Oas30SecurityScheme = document.components.createSecurityScheme("NewScheme");
                newScheme.type = "http";
                newScheme.scheme = "bearer";
                newScheme.bearerFormat = "JWT";
                return createNewSecuritySchemeCommand(document, newScheme);
            }
        );
    });

});

