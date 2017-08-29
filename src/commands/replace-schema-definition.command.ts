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
import {
    Oas20Definitions,
    Oas20Document,
    Oas20SchemaDefinition,
    Oas30Document,
    Oas30SchemaDefinition,
    OasDocument
} from "oai-ts-core";
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

    /**
     * Remove the given node.
     * @param doc
     * @param node
     */
    protected removeNode(doc: Oas20Document, node: Oas20SchemaDefinition): void {
        let definitions: Oas20Definitions = doc.definitions;
        definitions.removeDefinition(node.definitionName());
    }

    /**
     * Adds the node to the document.
     * @param doc
     * @param node
     */
    protected addNode(doc: Oas20Document, node: Oas20SchemaDefinition): void {
        let definitions: Oas20Definitions = doc.definitions;
        definitions.addDefinition(node.definitionName(), node);
    }

}


/**
 * A command used to replace a definition schema with a newer version.
 */
export class ReplaceSchemaDefinitionCommand_30 extends ReplaceNodeCommand<Oas30SchemaDefinition> implements ICommand {

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
        doc.components.addSchemaDefinition(node.name(), node);
    }

}

