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
import {Oas30Document, OasDocument, OasLibraryUtils} from "oai-ts-core";
import {createReplaceDocumentCommand} from "../../src/commands/replace-document.command";


describe("Replace Document", () => {

    it("Replace Document (simple)", () => {
        commandTest(
            "tests/_fixtures/commands/replace-document/3.0/replace-document.before.json",
            "tests/_fixtures/commands/replace-document/3.0/replace-document.after.json",
            (document: Oas30Document) => {
                let replacementObj: any = readJSON("tests/_fixtures/commands/replace-document/3.0/replace-document.after.json");
                let replacementDoc: OasDocument = new OasLibraryUtils().createDocument(replacementObj);
                return createReplaceDocumentCommand(document, replacementDoc);
            }
        );
    });

});

