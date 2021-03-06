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
import {createNewParamCommand} from "../../src/commands/new-param.command";
import {SimplifiedParameterType, SimplifiedType} from "../../src/models/simplified-type.model";


describe("New Parameter (2.0)", () => {

    it("New Parameter", () => {
        commandTest(
            "tests/_fixtures/commands/new-param/2.0/new-param.before.json",
            "tests/_fixtures/commands/new-param/2.0/new-param.after.json",
            (document: Oas20Document) => {
                return createNewParamCommand(document, document.paths.pathItem("/pets").get as Oas20Operation, "newParameter", "query");
            }
        );
    });

    it("New Parameter (With Both)", () => {
        commandTest(
            "tests/_fixtures/commands/new-param/2.0/new-param-both.before.json",
            "tests/_fixtures/commands/new-param/2.0/new-param-both.after.json",
            (document: Oas30Document) => {
                let newType: SimplifiedParameterType = new SimplifiedParameterType();
                newType.type = "array";
                newType.of = new SimplifiedType();
                newType.of.type = "string";
                newType.required = true;
                return createNewParamCommand(document, document.paths.pathItem("/pets").get as Oas20Operation,
                    "newParameter", "query", "Hello World.", newType);
            }
        );
    });

});


describe("New Parameter (3.0)", () => {

    it("New Parameter", () => {
        commandTest(
            "tests/_fixtures/commands/new-param/3.0/new-param.before.json",
            "tests/_fixtures/commands/new-param/3.0/new-param.after.json",
            (document: Oas30Document) => {
                return createNewParamCommand(document, document.paths.pathItem("/foo").get as Oas30Operation,
                    "newParameter", "query");
            }
        );
    });

    it("New Parameter (Override)", () => {
        commandTest(
            "tests/_fixtures/commands/new-param/3.0/override-param.before.json",
            "tests/_fixtures/commands/new-param/3.0/override-param.after.json",
            (document: Oas30Document) => {
                return createNewParamCommand(document, document.paths.pathItem("/foo").get as Oas30Operation,
                    "username", "path", null, null, true);
            }
        );
    });

    it("New Parameter (With Description)", () => {
        commandTest(
            "tests/_fixtures/commands/new-param/3.0/new-param-description.before.json",
            "tests/_fixtures/commands/new-param/3.0/new-param-description.after.json",
            (document: Oas30Document) => {
                return createNewParamCommand(document, document.paths.pathItem("/foo").get as Oas30Operation,
                    "newParameter", "query", "An included description.");
            }
        );
    });

    it("New Parameter (With Type)", () => {
        commandTest(
            "tests/_fixtures/commands/new-param/3.0/new-param-type.before.json",
            "tests/_fixtures/commands/new-param/3.0/new-param-type.after.json",
            (document: Oas30Document) => {
                let newType: SimplifiedParameterType = new SimplifiedParameterType();
                newType.type = "array";
                newType.of = new SimplifiedType();
                newType.of.type = "string";
                return createNewParamCommand(document, document.paths.pathItem("/foo").get as Oas30Operation,
                    "newParameter", "query", null, newType);
            }
        );
    });

    it("New Parameter (With Both)", () => {
        commandTest(
            "tests/_fixtures/commands/new-param/3.0/new-param-both.before.json",
            "tests/_fixtures/commands/new-param/3.0/new-param-both.after.json",
            (document: Oas30Document) => {
                let newType: SimplifiedParameterType = new SimplifiedParameterType();
                newType.type = "array";
                newType.of = new SimplifiedType();
                newType.of.type = "string";
                newType.required = true;
                return createNewParamCommand(document, document.paths.pathItem("/foo").get as Oas30Operation,
                    "newParameter", "query", "Hello World.", newType);
            }
        );
    });

});

