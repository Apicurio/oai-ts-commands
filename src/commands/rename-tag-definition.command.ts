/**
 * @license
 * Copyright 2019 JBoss Inc
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
import {
    IOasNodeVisitor,
    OasCombinedVisitorAdapter,
    OasDocument,
    OasOperation,
    OasTag,
    OasVisitorUtil
} from "oai-ts-core";

/**
 * Factory function.
 */
export function createRenameTagDefinitionCommand(oldTag: string, newTag: string): RenameTagDefinitionCommand {
    return new RenameTagDefinitionCommand(oldTag, newTag);
}

/**
 * A command used to rename a tag, along with all references to it.
 */
export class RenameTagDefinitionCommand extends AbstractCommand implements ICommand {

    private _oldTag: string;
    private _newTag: string;

    /**
     * C'tor.
     * @param oldTag
     * @param newTag
     */
    constructor(oldTag: string, newTag: string) {
        super();
        this._oldTag = oldTag;
        this._newTag = newTag;
    }

    protected type(): string {
        return "RenameTagDefinitionCommand";
    }

    /**
     * Renames a tag definition.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[RenameTagDefinitionCommand] Executing.");
        this._doTagRename(document, this._oldTag, this._newTag);
    }

    /**
     * Restores the previous tag name.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[RenameTagDefinitionCommand] Reverting.");
        this._doTagRename(document, this._newTag, this._oldTag);
    }

    /**
     * Does the work of renaming a tag from one name to another.
     * @param document
     * @param from
     * @param to
     * @private
     */
    private _doTagRename(document: OasDocument, from: string, to: string): void {
        // If the "to" tag already exists, bail out before doing anything
        let existingTag: OasTag = this._findTag(document, to);
        if (!this.isNullOrUndefined(existingTag)) {
            return;
        }

        // Find the tag by name and rename it.
        let tagToRename: OasTag = this._findTag(document, from);
        if (tagToRename) {
            // Now rename the tag
            tagToRename.name = to;
            // Rename every **usage** of the tag in the document (all operations)
            let tagRenamer: IOasNodeVisitor = new TagRenameVisitor(from, to);
            OasVisitorUtil.visitTree(document, tagRenamer);
        }
    }

    /**
     * Finds a tag in the document by name.  Returns null if not found.
     * @param document
     * @param tag
     * @private
     */
    private _findTag(document: OasDocument, tag: string): OasTag {
        if (document.tags) {
            for (let tagDef of document.tags) {
                if (tagDef.name === tag) {
                    return tagDef;
                }
            }
        }
        return null;
    }
}


/**
 * Visitor used to rename tag usage in all operations in the document.
 */
export class TagRenameVisitor extends OasCombinedVisitorAdapter {

    /**
     * C'tor.
     * @param from
     * @param to
     */
    constructor(private from: string, private to: string) { super(); }

    /**
     * Visit an operation (works for both 2.0 and 3.x).
     * @param node
     */
    public visitOperation(node: OasOperation): void {
        let idx: number = node.tags ? node.tags.indexOf(this.from) : -1;
        if (idx !== -1) {
            node.tags.splice(idx, 1, this.to);
        }
    }

}