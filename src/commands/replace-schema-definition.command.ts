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
import {Oas20Document, Oas20SchemaDefinition, Oas30Document, Oas30SchemaDefinition, OasDocument} from "oai-ts-core";
import {ReplaceNodeCommand} from "./replace.command";


/**
 * Factory function.
 */
export function createReplaceSchemaDefinitionCommand(document: OasDocument,
                                              old: Oas20SchemaDefinition | Oas30SchemaDefinition,
                                              replacement: Oas20SchemaDefinition | Oas30SchemaDefinition): ReplaceNodeCommand<Oas20SchemaDefinition> | ReplaceNodeCommand<Oas30SchemaDefinition> {
    if (document.getSpecVersion() === "2.0") {
        return new ReplaceSchemaDefinitionCommand_20(old as Oas20SchemaDefinition, replacement as Oas20SchemaDefinition);
    } else {
        return new ReplaceSchemaDefinitionCommand_30(old as Oas30SchemaDefinition, replacement as Oas30SchemaDefinition);
    }
}

/**
 * A command used to replace a definition schema with a newer version.
 */
export class ReplaceSchemaDefinitionCommand_20 extends ReplaceNodeCommand<Oas20SchemaDefinition> implements ICommand {

    private _defName: string;

    /**
     * @param {Oas20SchemaDefinition} old
     * @param {Oas20SchemaDefinition} replacement
     */
    constructor(old: Oas20SchemaDefinition, replacement: Oas20SchemaDefinition) {
        super(old, replacement);
        if (old) {
            this._defName = old.definitionName();
        }
    }

    /**
     * @return {string}
     */
    protected type(): string {
        return "ReplaceSchemaDefinitionCommand_20";
    }

    /**
     * Remove the given node.
     * @param doc
     * @param node
     */
    protected removeNode(doc: Oas20Document, node: Oas20SchemaDefinition): void {
        doc.definitions.removeDefinition(node.definitionName());
    }

    /**
     * Adds the node to the document.
     * @param doc
     * @param node
     */
    protected addNode(doc: Oas20Document, node: Oas20SchemaDefinition): void {
        node._ownerDocument = doc;
        node._parent = doc.definitions;
        doc.definitions.addDefinition(node.definitionName(), node);
    }

    /**
     * Reads a node into the appropriate model.
     * @param {Oas20Document} doc
     * @param node
     * @return {Oas20SchemaDefinition}
     */
    protected readNode(doc: Oas20Document, node: any): Oas20SchemaDefinition {
        let definition: Oas20SchemaDefinition = doc.definitions.createSchemaDefinition(this._defName) as Oas20SchemaDefinition;
        this.oasLibrary().readNode(node, definition);
        return definition;
    }

}


/**
 * A command used to replace a definition schema with a newer version.
 */
export class ReplaceSchemaDefinitionCommand_30 extends ReplaceNodeCommand<Oas30SchemaDefinition> implements ICommand {

    private _defName: string;

    /**
     * @param {Oas20SchemaDefinition} old
     * @param {Oas20SchemaDefinition} replacement
     */
    constructor(old: Oas30SchemaDefinition, replacement: Oas30SchemaDefinition) {
        super(old, replacement);
        if (old) {
            this._defName = old.name();
        }
    }

    /**
     * @return {string}
     */
    protected type(): string {
        return "ReplaceSchemaDefinitionCommand_30";
    }

    /**
     * Remove the given node.
     * @param doc
     * @param node
     */
    protected removeNode(doc: Oas30Document, node: Oas30SchemaDefinition): void {
        doc.components.removeSchemaDefinition(node.name());
    }

    /**
     * Adds the node to the document.
     * @param doc
     * @param node
     */
    protected addNode(doc: Oas30Document, node: Oas30SchemaDefinition): void {
        node._ownerDocument = doc;
        node._parent = doc.components;
        doc.components.addSchemaDefinition(node.name(), node);
    }

    /**
     * Reads a node into the appropriate model.
     * @param {Oas30Document} doc
     * @param node
     * @return {Oas30SchemaDefinition}
     */
    protected readNode(doc: Oas30Document, node: any): Oas30SchemaDefinition {
        let definition: Oas30SchemaDefinition = doc.components.createSchemaDefinition(this._defName) as Oas30SchemaDefinition;
        this.oasLibrary().readNode(node, definition);
        return definition;
    }

}

