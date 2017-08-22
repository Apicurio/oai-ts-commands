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
        return object === undefined || object === null;
    }

    /**
     * Gets access to the static OAS library.
     * @return {OasLibraryUtils}
     */
    protected oasLibrary(): OasLibraryUtils {
        return AbstractCommand._oasLibrary;
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

}
