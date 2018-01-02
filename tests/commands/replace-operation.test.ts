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
import {Oas20Document, Oas20Operation, Oas20PathItem, Oas30Document, Oas30Operation, Oas30PathItem} from "oai-ts-core";
import {createReplaceOperationCommand} from "../../src/commands/replace-operation.command";


describe("Replace Operation (2.0)", () => {

    it("Replace Operation", () => {
        commandTest(
            "tests/_fixtures/commands/replace-operation/2.0/replace-operation.before.json",
            "tests/_fixtures/commands/replace-operation/2.0/replace-operation.after.json",
            (document: Oas20Document) => {
                let pathItem: Oas20PathItem = document.paths.pathItem("/pets") as Oas20PathItem;
                let newOperation: Oas20Operation = pathItem.createOperation("get") as Oas20Operation;
                newOperation.summary = "Do A Thing";
                newOperation.description = "Totally does a thing";
                newOperation.operationId = "doAThing";
                newOperation.produces = [ "application/json" ];
                return createReplaceOperationCommand(document, pathItem.get as Oas20Operation, newOperation);
            }
        );
    });

});


describe("Replace Operation (3.0)", () => {

    it("Replace Operation", () => {
        commandTest(
            "tests/_fixtures/commands/replace-operation/3.0/replace-operation.before.json",
            "tests/_fixtures/commands/replace-operation/3.0/replace-operation.after.json",
            (document: Oas30Document) => {
                let pathItem: Oas30PathItem = document.paths.pathItem("/foo") as Oas30PathItem;
                let newOperation: Oas30Operation = pathItem.createOperation("get") as Oas30Operation;
                newOperation.summary = "Do A Thing";
                newOperation.description = "Totally does a thing";
                newOperation.operationId = "doAThing";
                newOperation.deprecated = true;
                return createReplaceOperationCommand(document, pathItem.get as Oas30Operation, newOperation);
            }
        );
    });

});

