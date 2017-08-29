/**
 * @contact
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/contacts/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {AbstractCommand, ICommand} from "../base";
import {OasDocument} from "oai-ts-core";

/**
 * Factory function.
 */
export function createChangeContactCommand(document: OasDocument, name: string, email: string, url: string): ChangeContactCommand {
    if (document.getSpecVersion() === "2.0") {
        return new ChangeContactCommand_20(name, email, url);
    } else {
        return new ChangeContactCommand_30(name, email, url);
    }
}

/**
 * A command used to modify the contact information of a document.
 */
export abstract class ChangeContactCommand extends AbstractCommand implements ICommand {

    private _newName: string;
    private _newEmail: string;
    private _newUrl: string;

    private _oldContact: any;
    private _nullInfo: boolean;

    /**
     * C'tor.
     * @param {string} name
     * @param {string} email
     * @param {string} url
     */
    constructor(name: string, email: string, url: string) {
        super();
        this._newName = name;
        this._newEmail = email;
        this._newUrl = url;
    }

    /**
     * Modifies the contact info.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangeContactCommand] Executing.");
        this._oldContact = null;
        this._nullInfo = false;

        if (document.info === undefined || document.info === null) {
            this._nullInfo = true;
            document.info = document.createInfo();
            this._oldContact = null;
        } else {
            this._oldContact = null;
            if (document.info.contact) {
                this._oldContact = this.oasLibrary().writeNode(document.info.contact);
            }
        }

        document.info.contact = document.info.createContact();
        document.info.contact.name = this._newName;
        document.info.contact.url = this._newUrl;
        document.info.contact.email = this._newEmail;
    }

    /**
     * Resets the contact back to the original value.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangeContactCommand] Reverting.");
        if (this._nullInfo) {
            document.info = null;
        } else if (this._oldContact) {
            document.info.contact = document.info.createContact();
            this.oasLibrary().readNode(this._oldContact, document.info.contact);
        } else {
            document.info.contact = null;
        }
    }

}


/**
 * The OAI 2.0 impl.
 */
export class ChangeContactCommand_20 extends ChangeContactCommand {

}


/**
 * The OAI 3.0 impl.
 */
export class ChangeContactCommand_30 extends ChangeContactCommand {

}
