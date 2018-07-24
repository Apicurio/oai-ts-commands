/**
 * @license
 * Copyright 2017 Red Hat
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


import {OasDocument, OasLibraryUtils} from "oai-ts-core";
import {ModelUtils} from "./util/model.util";

/**
 * A base class for all command implementations.
 */
export abstract class AbstractCommand {

    protected static _oasLibrary: OasLibraryUtils = new OasLibraryUtils();

    /**
     * Returns true of the argument is either null or undefined.
     * @param object
     */
    protected isNullOrUndefined(object: any): boolean {
        return ModelUtils.isNullOrUndefined(object);
    }

    /**
     * Gets access to the static OAS library.
     * @return {OasLibraryUtils}
     */
    protected oasLibrary(): OasLibraryUtils {
        return AbstractCommand._oasLibrary;
    }

    /**
     * Returns the type of the command (i.e. the command's class name).
     * @return {string}
     */
    protected abstract type(): string;

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        var cmdType: string = this.type();
        var obj: any = {
            __type: cmdType
        };
        let propNames: string[] = Object.getOwnPropertyNames(this);
        for (let propName of propNames) {
            obj[propName] = this[propName];
        }
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        let propNames: string[] = Object.getOwnPropertyNames(obj);
        for (let propName of propNames) {
            if (propName !== "__type") {
                this[propName] = obj[propName];
            }
        }
    }

}


/**
 * All editor commands must implement this interface.
 */
export interface ICommand {

    /**
     * Called to execute the command against the given document.
     * @param document
     */
    execute(document: OasDocument): void;

    /**
     * Called to undo the command (restore the document to a previous state).
     * @param document
     */
    undo(document: OasDocument): void;

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    marshall(): any;

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    unmarshall(obj: any): void;

}
