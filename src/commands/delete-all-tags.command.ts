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
export function createDeleteAllTagsCommand(): DeleteAllTagsCommand {
    return new DeleteAllTagsCommand();
}

/**
 * A command used to delete all tags from a document.
 */
export class DeleteAllTagsCommand extends AbstractCommand implements ICommand {

    private _oldTags: any[];

    /**
     * C'tor.
     */
    constructor() {
        super();
    }

    /**
     * Deletes the tags.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[DeleteAllTagsCommand] Executing.");
        this._oldTags = [];
        // Save the old tags (if any)
        if (!this.isNullOrUndefined(document.tags)) {
            document.tags.forEach( tag => {
                this._oldTags.push(this.oasLibrary().writeNode(tag));
            });
        }

        document.tags = [];
    }

    /**
     * Restore the old (deleted) tags.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[DeleteAllTagsCommand] Reverting.");
        if (this._oldTags.length === 0) {
            return;
        }

        if (this.isNullOrUndefined(document.tags)) {
            document.tags = [];
        }
        this._oldTags.forEach( oldTag => {
            let tag: OasTag = document.createTag();
            this.oasLibrary().readNode(oldTag, tag);
            document.tags.push(tag);
        });
    }

    protected type(): string {
        return "DeleteAllTagsCommand";
    }

}
