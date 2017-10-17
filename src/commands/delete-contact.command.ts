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
import {Oas20Contact, Oas30Contact, OasContact, OasDocument, OasNode} from "oai-ts-core";
import {DeleteNodeCommand} from "./delete-node.command";


/**
 * Factory function.
 */
export function createDeleteContactCommand(document: OasDocument): DeleteNodeCommand<Oas20Contact> | DeleteNodeCommand<Oas30Contact> {
    let property: string = "contact";
    let parent: OasNode = document.info;
    if (document.getSpecVersion() === "2.0") {
        return new DeleteContactCommand_20(property, parent);
    } else {
        return new DeleteContactCommand_30(property, parent);
    }
}


/**
 * A command used to delete the license.
 */
export abstract class AbstractDeleteContactCommand<T extends OasContact> extends DeleteNodeCommand<T> implements ICommand {

    /**
     * Unmarshalls a node into the appropriate type.
     * @param {OasDocument} doc
     * @param node
     * @return {T}
     */
    protected readNode(doc: OasDocument, node: any): T {
        let contact: T = doc.info.createContact() as T;
        this.oasLibrary().readNode(node, contact);
        return contact;
    }

}


/**
 * OAI 2.0 impl.
 */
export class DeleteContactCommand_20 extends AbstractDeleteContactCommand<Oas20Contact> {

    protected type(): string {
        return "DeleteContactCommand_20";
    }

}


/**
 * OAI 3.0 impl.
 */
export class DeleteContactCommand_30 extends AbstractDeleteContactCommand<Oas30Contact> {

    protected type(): string {
        return "DeleteContactCommand_30";
    }

}
