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
import {ICommand} from "../src/base";

var library = new OasLibraryUtils();

export function commandTest(beforeFile: string, afterFile: string, command: (document: OasDocument) => ICommand, debug?: boolean): void {
    let before: any = readJSON(beforeFile);
    let after: any = readJSON(afterFile);

    expect(before === undefined).toBeFalsy();
    expect(after === undefined).toBeFalsy();
    expect(before === null).toBeFalsy();
    expect(after === null).toBeFalsy();

    let document: OasDocument = library.createDocument(before);

    // Create the command.
    let cmd: ICommand = command(document);

    // Execute the command
    cmd.execute(document);

    // Check the result.
    let actual: any = library.writeNode(document);
    let expected: any = after;
    if (debug) {
        console.info("------- ACTUAL (exec) --------\n " + JSON.stringify(actual, null, 2) + "\n-------------------");
        console.info("------- EXPECTED (exec) --------\n " + JSON.stringify(expected, null, 2) + "\n-------------------");
    }
    expect(actual).toEqual(expected);

    // Undo the command
    cmd.undo(document);

    // Check again
    actual = library.writeNode(document);
    expected = before;
    if (debug) {
        console.info("------- ACTUAL (undo) --------\n " + JSON.stringify(actual, null, 2) + "\n-------------------");
        console.info("------- EXPECTED (undo) --------\n " + JSON.stringify(expected, null, 2) + "\n-------------------");
    }
    expect(actual).toEqual(expected);

}