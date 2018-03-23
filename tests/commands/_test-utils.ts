///<reference path="../../node_modules/@types/jasmine/index.d.ts"/>
///<reference path="../../tests/@types/karma-read-json/index.d.ts"/>
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
import {ICommand} from "../../src/base";
import {MarshallUtils} from "../../src/util/marshall.util";
import * as JsDiff from "diff";

var library = new OasLibraryUtils();

export function commandTest(beforeFile: string, afterFile: string, command: (document: OasDocument) => ICommand, debug?: boolean): void {
    if (debug) {
        console.info("TEST:: Loading before/after files.")
    }

    let before: any = readJSON(beforeFile);
    let after: any = readJSON(afterFile);

    expect(before === undefined).toBeFalsy();
    expect(after === undefined).toBeFalsy();
    expect(before === null).toBeFalsy();
    expect(after === null).toBeFalsy();

    if (debug) {
        console.info("TEST:: Creating 'before' document.")
    }

    let document: OasDocument = library.createDocument(before);

    if (debug) {
        console.info("TEST:: Creating the command to be tested.")
    }

    // Create the command.
    let cmd: ICommand = command(document);

    if (debug) {
        console.info("TEST:: Serializing/deserializing the command.")
    }

    // Serialize/deserialize the command
    let serializedCmd: string = JSON.stringify(MarshallUtils.marshallCommand(cmd));
    cmd = MarshallUtils.unmarshallCommand(JSON.parse(serializedCmd));

    if (debug) {
        console.info("TEST:: Executing the command.")
    }

    // Execute the command
    cmd.execute(document);

    if (debug) {
        console.info("TEST:: Asserting the command worked.")
    }

    // Check the result.
    let actual: any = library.writeNode(document);
    let expected: any = after;
    let failureOutput: string = "";
    {
        let changes: any[] = JsDiff.diffJson(actual, expected);
        changes.forEach( change => {
            if (change.added) {
                console.info("--- EXPECTED BUT MISSING ---\n" + change.value);
                console.info("----------------------------");
            }
            if (change.removed) {
                console.info("--- FOUND EXTRA ---\n" + change.value);
                console.info("-------------------");
            }
        });

    }
    expect(actual).toEqual(expected, failureOutput);

    if (debug) {
        console.info("TEST:: Serializing/deserializing the command (again).")
    }

    // Serialize/deserialize the command (again)
    serializedCmd = JSON.stringify(MarshallUtils.marshallCommand(cmd));
    cmd = MarshallUtils.unmarshallCommand(JSON.parse(serializedCmd));

    if (debug) {
        console.info("TEST:: Undoing the command.")
    }

    // Undo the command
    cmd.undo(document);

    if (debug) {
        console.info("TEST:: Asserting that the undo() worked.")
    }

    // Check again
    actual = library.writeNode(document);
    expected = before;
    failureOutput = "";
    {
        let changes: any[] = JsDiff.diffJson(actual, expected);
        changes.forEach( change => {
            if (change.added) {
                console.info("--- EXPECTED BUT MISSING ---\n" + change.value);
                console.info("----------------------------");
            }
            if (change.removed) {
                console.info("--- FOUND EXTRA ---\n" + change.value);
                console.info("-------------------");
            }
        });
    }
    expect(actual).toEqual(expected, failureOutput);
}