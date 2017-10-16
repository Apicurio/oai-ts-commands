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
 * Factory function.
 */
export function createChangeDescriptionCommand(document: OasDocument, newDescription: string): ChangeDescriptionCommand {
    if (document.getSpecVersion() === "2.0") {
        return new ChangeDescriptionCommand_20(newDescription);
    } else {
        return new ChangeDescriptionCommand_30(newDescription);
    }
}

/**
 * A command used to modify the description of a document.
 */
export abstract class ChangeDescriptionCommand extends AbstractCommand implements ICommand {

    private _newDescription: string;

    private _oldDescription: string;
    private _nullInfo: boolean;

    /**
     * C'tor.
     * @param {string} newDescription
     */
    constructor(newDescription: string) {
        super();
        this._newDescription = newDescription;
    }

    /**
     * Modifies the description of the document.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangeDescriptionCommand] Executing.");
        if (document.info === undefined || document.info === null) {
            document.info = document.createInfo();
            this._nullInfo = true;
            this._oldDescription = null;
        } else {
            this._oldDescription = document.info.description;
        }
        document.info.description = this._newDescription;
    }

    /**
     * Resets the description back to a previous version.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangeDescriptionCommand] Reverting.");
        if (this._nullInfo) {
            document.info = null;
        } else {
            document.info.description = this._oldDescription;
        }
    }

}


/**
 * The OAI 2.0 impl.
 */
export class ChangeDescriptionCommand_20 extends ChangeDescriptionCommand {

    protected type(): string {
        return "ChangeDescriptionCommand_20";
    }

}


/**
 * The OAI 3.0 impl.
 */
export class ChangeDescriptionCommand_30 extends ChangeDescriptionCommand {

    protected type(): string {
        return "ChangeDescriptionCommand_30";
    }

}