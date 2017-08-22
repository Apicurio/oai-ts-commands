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

import {Oas20Items, Oas20ItemsSchema, OasSchema} from "oai-ts-core";


/**
 * Allowable simple type values:
 *   - string
 *     - byte
 *     - binary
 *     - date
 *     - date-time
 *     - password
 *   - number
 *     - float
 *     - double
 *   - integer
 *     - int32
 *     - int64
 *   - boolean
 */
export class SimplifiedType {

    public static fromItems(items: Oas20Items): SimplifiedType {
        let rval: SimplifiedType = new SimplifiedType();
        if (items && items.type && items.type !== "array" && items.type !== "object" && items.type !== "file") {
            rval.type = items.type;
            if (items.format) {
                rval.as = items.format;
            }
        }
        if (items && items.type === "array" && items.items && !Array.isArray(items.items)) {
            rval.type = "array";
            rval.of = SimplifiedType.fromItems(items.items);
        }
        return rval;
    }

    public static fromSchema(schema: OasSchema): SimplifiedType {
        let rval: SimplifiedType = new SimplifiedType();
        if (schema && schema.$ref) {
            rval.type = schema.$ref;
        }
        if (schema && schema.type && schema.type !== "array" &&
            schema.type !== "object" && schema.type !== "file")
        {
            rval.type = schema.type;
            if (schema.format) {
                rval.as = schema.format;
            }
        }
        if (schema && schema.type === "array" && schema.items && !Array.isArray(schema.items)) {
            rval.type = "array";
            rval.of = SimplifiedType.fromSchema(<Oas20ItemsSchema>schema.items);
        }
        return rval;
    }

    type: string;
    of: SimplifiedType;
    as: string;

    public isSimpleType(): boolean {
        return ["string", "number", "integer", "boolean"].indexOf(this.type) !== -1;
    }

    public isArray(): boolean {
        return this.type === "array";
    }

    public isRef(): boolean {
        return !this.isNullOrUndefined(this.type) && this.type.indexOf("#/") === 0;
    }

    protected isNullOrUndefined(object: any): boolean {
        return object === undefined || object === null;
    }

}

