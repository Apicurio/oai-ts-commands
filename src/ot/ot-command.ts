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

import {ICommand} from "../base";
import {OasDocument} from "oai-ts-core";

export class OtCommand {

    public author: string;
    public contentVersion: number;
    public command: ICommand;
    public local: boolean;
    public reverted: boolean;

    /**
     * Executes the command against the given document.  Skips execution if the command
     * has been reverted/undone.
     * @param document
     */
    public execute(document: OasDocument): void {
        if (!this.reverted) {
            this.command.execute(document);
        }
    }

    /**
     * Invokes 'undo' on the underlying ICommand but only if it hasn't already been reverted.
     * Any command already reverted will simply be skipped.
     * @param document
     */
    public undo(document: OasDocument): void {
        if (this.reverted) {
            //console.info("Skipped undo of CV: ", this);
        } else {
            this.command.undo(document);
            this.reverted = true;
        }
    }

    /**
     * Invokes 'redo' on the underlying ICommand but only if it hasn't already been reverted.
     * Any command already reverted will simply be skipped.
     * @param document
     */
    public redo(document: OasDocument): void {
        if (!this.reverted) {
            //console.info("Skipped redo of CV: ", this);
        } else {
            this.command.execute(document);
            this.reverted = false;
        }
    }

}
