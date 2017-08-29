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
import {Oas20Operation, Oas20Parameter, Oas30Operation, OasDocument, OasNodePath, OasOperation} from "oai-ts-core";

/**
 * Factory function.
 */
export function createNewRequestBodyCommand(document: OasDocument, operation: Oas20Operation | Oas30Operation): NewRequestBodyCommand {
    if (document.getSpecVersion() === "2.0") {
        return new NewRequestBodyCommand_20(operation);
    } else {
        return new NewRequestBodyCommand_30(operation);
    }
}

/**
 * A command used to create a new request body (parameter of an operation).
 */
export abstract class NewRequestBodyCommand extends AbstractCommand implements ICommand {

    private _operationPath: OasNodePath;
    
    private _created: boolean;

    /**
     * C'tor.
     * @param {Oas20Operation} operation
     */
    constructor(operation: Oas20Operation | Oas30Operation) {
        super();
        this._operationPath = this.oasLibrary().createNodePath(operation);
    }

    /**
     * Creates a request body parameter for the operation.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[NewRequestBodyCommand] Executing.");

        this._created = false;

        let operation: OasOperation = this._operationPath.resolve(document) as OasOperation;
        if (this.isNullOrUndefined(operation)) {
            return;
        }
        if (this.hasRequestBody(operation)) {
            return;
        }

        this.doCreateRequestBody(operation);
        this._created = true;
    }

    /**
     * Removes the previously created body param.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[NewRequestBodyCommand] Reverting.");
        if (!this._created) {
            return;
        }

        let operation: OasOperation = this._operationPath.resolve(document) as OasOperation;
        if (this.isNullOrUndefined(operation)) {
            return;
        }

        this.doRemoveRequestBody(operation);
    }

    /**
     * Returns true if the given operation already has a body parameter.
     * @param {OasOperation} operation
     * @return {boolean}
     */
    protected abstract hasRequestBody(operation: OasOperation): boolean;

    /**
     * Creates an empty request body for the given operation.
     * @param {OasOperation} operation
     */
    protected abstract doCreateRequestBody(operation: OasOperation): void;

    /**
     * Removes the request body.
     */
    protected abstract doRemoveRequestBody(operation: OasOperation): void;
}


/**
 * OAI 2.0 impl.
 */
export class NewRequestBodyCommand_20 extends NewRequestBodyCommand {

    /**
     * Returns true if the given operation has a body param.
     * @param {Oas20Operation} operation
     * @return {boolean}
     */
    protected hasRequestBody(operation: Oas20Operation): boolean {
        return operation.parameters && operation.parameters.filter((value) => {
            return value.in === "body";
        }).length > 0;
    }

    /**
     * Creates a body parameter for the given operation.
     * @param {OasOperation} operation
     */
    protected doCreateRequestBody(operation: Oas20Operation): void {
        if (this.isNullOrUndefined(operation.parameters)) {
            operation.parameters = [];
        }
        let param: Oas20Parameter = operation.createParameter();
        param.in = "body";
        param.name = "body";
        operation.addParameter(param);
    }

    /**
     * Removes the body parameter.
     * @param {Oas20Operation} operation
     */
    protected doRemoveRequestBody(operation: Oas20Operation): void {
        let bodyParam: Oas20Parameter = null;
        for (let param of operation.parameters) {
            if (param.in === "body") {
                bodyParam = param as Oas20Parameter;
                break;
            }
        }

        // If found, remove it from the params.
        if (bodyParam) {
            operation.parameters.splice(operation.parameters.indexOf(bodyParam), 1);

            if (operation.parameters.length === 0) {
                operation.parameters = null;
            }
        }
    }

}


/**
 * OAI 3.0 impl.
 */
export class NewRequestBodyCommand_30 extends NewRequestBodyCommand {

    /**
     * Returns true if the given operation already has a request body.
     * @param {OasOperation} operation
     * @return {boolean}
     */
    protected hasRequestBody(operation: Oas30Operation): boolean {
        return !this.isNullOrUndefined(operation.requestBody);
    }

    /**
     * Creates a new, empty request body.
     * @param {OasOperation} operation
     */
    protected doCreateRequestBody(operation: Oas30Operation): void {
        operation.requestBody = operation.createRequestBody();
    }

    /**
     * Removes the request body.
     * @param {OasOperation} operation
     */
    protected doRemoveRequestBody(operation: Oas30Operation): void {
        operation.requestBody = null;
    }

}