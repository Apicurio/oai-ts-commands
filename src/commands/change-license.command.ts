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
import {OasDocument, Oas20Document, Oas20License} from "oai-ts-core";

/**
 * A command used to modify the license information of a document.
 */
export abstract class AbstractChangeLicenseCommand extends AbstractCommand implements ICommand {

    private _newLicenseName: string;
    private _newLicenseUrl: string;

    private _oldLicense: any;
    private _nullInfo: boolean;

    /**
     * C'tor.
     * @param {string} name
     * @param {string} url
     */
    constructor(name: string, url: string) {
        super();
        this._newLicenseName = name;
        this._newLicenseUrl = url;
    }

    /**
     * Modifies the license.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[ChangeLicenseCommand] Executing.");
        this._oldLicense = null;
        this._nullInfo = false;

        if (this.isNullOrUndefined(document.info)) {
            this._nullInfo = true;
            document.info = document.createInfo();
            this._oldLicense = null;
        } else {
            this._oldLicense = null;
            if (!this.isNullOrUndefined(document.info.license)) {
                this._oldLicense = this.oasLibrary().writeNode(document.info.license);
            }
        }
        document.info.license = document.info.createLicense();
        document.info.license.name = this._newLicenseName;
        document.info.license.url = this._newLicenseUrl;
    }

    /**
     * Resets the license back to the original value.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[ChangeLicenseCommand] Reverting.");
        if (this._nullInfo) {
            document.info = null;
        } else if (this._oldLicense) {
            document.info.license = document.info.createLicense();
            this.oasLibrary().readNode(this._oldLicense, document.info.license);
        } else {
            document.info.license = null;
        }
    }

}


/**
 * The OAI 2.0 impl.
 */
export class ChangeLicenseCommand_20 extends AbstractChangeLicenseCommand {

}


/**
 * The OAI 3.0 impl.
 */
export class ChangeLicenseCommand_30 extends AbstractChangeLicenseCommand {

}