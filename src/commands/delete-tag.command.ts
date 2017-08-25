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
 * A command used to delete a single tag definition from the document.
 */
export abstract class AbstractDeleteTagCommand extends AbstractCommand implements ICommand {

    private _tagName: string;

    private _oldIndex: number;
    private _oldTag: any;

    /**
     * C'tor.
     * @param {string} tagName
     */
    constructor(tagName: string) {
        super();
        this._tagName = tagName;
    }

    /**
     * Deletes the tag.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteTagCommand] Executing.");

        if (this.isNullOrUndefined(document.tags)) {
            return;
        }

        let tags: OasTag[] = document.tags;
        let tag: OasTag = null;
        for (let t of tags) {
            if (t.name === this._tagName) {
                tag = t;
            }
        }
        this._oldIndex = tags.indexOf(tag);
        tags.splice(this._oldIndex, 1);
        this._oldTag = this.oasLibrary().writeNode(tag);
    }

    /**
     * Restore the old (deleted) tag.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteTagCommand] Reverting.");

        if (this.isNullOrUndefined(document.tags)) {
            document.tags = [];
        }

        let tag: OasTag = document.createTag();
        this.oasLibrary().readNode(this._oldTag, tag);
        if (document.tags.length >= this._oldIndex) {
            document.tags.splice(this._oldIndex, 0, tag);
        } else {
            document.tags.push(tag);
        }
    }

}


/**
 * OAI 2.0 impl.
 */
export class DeleteTagCommand_20 extends AbstractDeleteTagCommand {

}


/**
 * OAI 3.0 impl.
 */
export class DeleteTagCommand_30 extends AbstractDeleteTagCommand {

}
