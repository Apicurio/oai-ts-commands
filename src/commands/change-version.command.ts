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
import {OasDocument, Oas20Document} from "oai-ts-core";

/**
 * A command used to modify the version of a document.
 */
export abstract class AbstractChangeVersionCommand extends AbstractCommand implements ICommand {

    private _newVersion: string;

    private _oldVersion: string;
    private _nullInfo: boolean;

    /**
     * C'tor.
     * @param {string} newVersion
     */
    constructor(newVersion: string) {
        super();
        this._newVersion = newVersion;
    }

    /**
     * Modifies the version of the document.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangeVersionCommand] Executing.");
        if (document.info === undefined || document.info === null) {
            document.info = document.createInfo();
            this._nullInfo = true;
            this._oldVersion = null;
        } else {
            this._oldVersion = document.info.version;
        }
        document.info.version = this._newVersion;
    }

    /**
     * Resets the version back to a previous version.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangeVersionCommand] Reverting.");
        if (this._nullInfo) {
            document.info = null;
        } else {
            document.info.version = this._oldVersion;
        }
    }

}


/**
 * OAI 2.0 impl.
 */
export class ChangeVersionCommand_20 extends AbstractChangeVersionCommand {

}


/**
 * OAI 3.0 impl.
 */
export class ChangeVersionCommand_30 extends AbstractChangeVersionCommand {

}