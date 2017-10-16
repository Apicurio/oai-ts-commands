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
import {OasDocument, OasTag} from "oai-ts-core";

/**
 * Factory function.
 */
export function createNewTagCommand(document: OasDocument, name: string, description?: string): NewTagCommand {
    if (document.getSpecVersion() === "2.0") {
        return new NewTagCommand_20(name, description);
    } else {
        return new NewTagCommand_30(name, description);
    }
}

/**
 * A command used to create a new tag.
 */
export abstract class NewTagCommand extends AbstractCommand implements ICommand {

    private _tagName: string;
    private _tagDescription: string;

    private _created: boolean;

    /**
     * Constructor.
     * @param {string} name
     * @param {string} description
     */
    constructor(name: string, description?: string) {
        super();
        this._tagName = name;
        this._tagDescription = description;
    }

    /**
     * Creates a request body parameter for the operation.
     * @param {OasDocument} document
     */
    public execute(document: OasDocument): void {
        console.info("[NewTagCommand] Executing.");

        this._created = false;

        if (this.isNullOrUndefined(document.tags)) {
            document.tags = [];
        }

        let tag: OasTag = this.findTag(document, this._tagName);
        if (this.isNullOrUndefined(tag)) {
            document.addTag(this._tagName, this._tagDescription);
            this._created = true;
        }
    }

    /**
     * Removes the previously created query param.
     * @param {OasDocument} document
     */
    public undo(document: OasDocument): void {
        console.info("[NewTagCommand] Reverting.");
        if (!this._created) {
            return;
        }

        let tag: OasTag = this.findTag(document, this._tagName);
        if (this.isNullOrUndefined(tag)) {
            return;
        }
        document.tags.splice(document.tags.indexOf(tag), 1);
    }

    /**
     * Finds a single tag by its name.  No way to do this but iterate through the
     * tags array.
     * @param {OasDocument} doc
     * @param {string} tagName
     * @return {OasTag}
     */
    private findTag(doc: OasDocument, tagName: string): OasTag {
        for (let dt of doc.tags) {
            if (dt.name === tagName) {
                return dt;
            }
        }
        return null;
    }

}


/**
 * OAI 2.0 impl.
 */
export class NewTagCommand_20 extends NewTagCommand {

    protected type(): string {
        return "NewTagCommand_20";
    }

}


/**
 * OAI 3.0 impl.
 */
export class NewTagCommand_30 extends NewTagCommand {

    protected type(): string {
        return "NewTagCommand_30";
    }

}