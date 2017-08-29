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

import {AbstractCommand, ICommand} from "../base";
import {OasDocument} from "oai-ts-core";

/**
 * Factory function.
 */
export function createChangeTitleCommand(document: OasDocument, newTitle: string): ChangeTitleCommand {
    if (document.getSpecVersion() === "2.0") {
        return new ChangeTitleCommand_20(newTitle);
    } else {
        return new ChangeTitleCommand_30(newTitle);
    }
}

/**
 * A command used to modify the title of a document.
 */
export abstract class ChangeTitleCommand extends AbstractCommand implements ICommand {

    private _newTitle: string;

    private _oldTitle: string;
    private _nullInfo: boolean;

    /**
     * C'tor.
     * @param {string} newTitle
     */
    constructor(newTitle: string) {
        super();
        this._newTitle = newTitle;
    }

    /**
     * Modifies the title of the document.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangeTitleCommand] Executing.");
        if (document.info === undefined || document.info === null) {
            document.info = document.createInfo();
            this._nullInfo = true;
            this._oldTitle = null;
        } else {
            this._oldTitle = document.info.title;
        }
        document.info.title = this._newTitle;
    }

    /**
     * Resets the title back to a previous version.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangeTitleCommand] Reverting.");
        if (this._nullInfo) {
            document.info = null;
        } else {
            document.info.title = this._oldTitle;
        }
    }

}


/**
 * OAI 2.0 impl.
 */
export class ChangeTitleCommand_20 extends ChangeTitleCommand {

}


/**
 * OAI 3.0 impl.
 */
export class ChangeTitleCommand_30 extends ChangeTitleCommand {

}

