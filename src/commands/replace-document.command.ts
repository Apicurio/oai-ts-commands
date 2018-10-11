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
import {Oas20Document, Oas30Document, OasDocument} from "oai-ts-core";
import {ReplaceNodeCommand} from "./replace.command";


/**
 * Factory function.
 */
export function createReplaceDocumentCommand(document: OasDocument, replacement: OasDocument): ReplaceDocumentCommand {
    return new ReplaceDocumentCommand(document, replacement);
}


/**
 * A command used to replace a path item with a newer version.
 */
export class ReplaceDocumentCommand extends ReplaceNodeCommand<OasDocument> implements ICommand {

    /**
     * @return {string}
     */
    protected type(): string {
        return "ReplaceDocumentCommand";
    }

    /**
     * Removes the old node.  In this case it's the root document, which can't be removed.  So
     * instead we will null out all of the document's properties.
     * @param doc
     * @param node
     */
    protected removeNode(doc: OasDocument, node: OasDocument): void {
        if (node.is2xDocument()) {
            this.reset2xDocument(node as Oas20Document);
        } else {
            this.reset3xDocument(node as Oas30Document);
        }
    }

    /**
     * Adds the node to the model.  In this case it's the root document, so there's nothing to
     * do here.
     * @param doc
     * @param node
     */
    protected addNode(doc: OasDocument, node: OasDocument): void {
        // Do nothing - the node being "added" is the root document node.
    }

    /**
     * Read the data into a new node.  In this case we're reading the data into the
     * root document node.
     * @param doc
     * @param node
     */
    protected readNode(doc: OasDocument, node: any): OasDocument {
        this.oasLibrary().readNode(node, doc);
        return doc;
    }

    /**
     * Resets a 2.0 OAI document by nulling out all of its properties.
     * @param doc
     */
    private reset2xDocument(doc: Oas20Document): void {
        doc.host = null;
        doc.basePath = null;
        doc.schemes= null;
        doc.consumes= null;
        doc.produces= null;
        doc.definitions = null;
        doc.parameters = null;
        doc.responses = null;
        doc.securityDefinitions = null;
        this.resetDocument(doc);
    }

    /**
     * Resets a 3.x OAI document by nulling out all of its properties.
     * @param doc
     */
    private reset3xDocument(doc: Oas30Document): void {
        doc.servers = null;
        doc.components = null;
        this.resetDocument(doc);
    }

    /**
     * Resets the common properties.
     * @param doc
     */
    private resetDocument(doc: OasDocument): void {
        doc.info = null;
        doc.paths = null;
        doc.security = null;
        doc.tags = null;
        doc.externalDocs = null;

        doc["_extensions"] = null;
        doc["_extraProperties"] = {};
    }

}
