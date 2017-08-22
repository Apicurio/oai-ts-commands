///<reference path="@types/karma-read-json/index.d.ts"/>
/**
 * @license
 * Copyright 2017 JBoss Inc
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

import {OasDocument, OasLibraryUtils} from "oai-ts-core";

var library = new OasLibraryUtils();

export function commandTest(beforeFile: string, afterFile: string, mutator: (document: OasDocument) => void, debug?: boolean): void {
    let json: any = readJSON(beforeFile);
    let document: OasDocument = library.createDocument(json);

    // Create and execute the command.
    mutator(document);

    // Check the result.
    let actual: any = library.writeNode(document);
    let expected: any = readJSON(afterFile);

    if (debug) {
        console.info("------- ACTUAL --------\n " + JSON.stringify(actual, null, 2) + "\n-------------------");
        console.info("------- EXPECTED --------\n " + JSON.stringify(expected, null, 2) + "\n-------------------");
    }

    expect(actual).toEqual(expected);
}