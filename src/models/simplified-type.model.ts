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

import {
    Oas20Items, Oas20ItemsSchema, Oas20Parameter, Oas20PropertySchema, Oas30Parameter, Oas30PropertySchema,
    OasSchema
} from "oai-ts-core";
import {ModelUtils} from "../util/model.util";


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
        if (items && items.enum && items.enum.length >= 0) {
            // Need to clone the enum values
            rval.enum = JSON.parse(JSON.stringify(items.enum));
        }
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
        if (schema && schema.enum && schema.enum.length >= 0) {
            // Need to clone the enum values
            rval.enum = JSON.parse(JSON.stringify(schema.enum));
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
    enum: any[];
    of: SimplifiedType;
    as: string;

    public isSimpleType(): boolean {
        return ["string", "number", "integer", "boolean"].indexOf(this.type) !== -1;
    }

    public isEnum(): boolean {
        return this.enum !== null && this.enum !== undefined && this.enum.length >= 0;
    }

    public isArray(): boolean {
        return this.type === "array";
    }

    public isRef(): boolean {
        return !ModelUtils.isNullOrUndefined(this.type) && this.type.indexOf("#/") === 0;
    }

}


/**
 * Adds the "required" property to the standard SimplifiedType.
 */
export class SimplifiedParameterType extends SimplifiedType {

    public static fromParameter(param: Oas20Parameter | Oas30Parameter): SimplifiedParameterType {
        let rval: SimplifiedParameterType = new SimplifiedParameterType();
        let st: SimplifiedType;
        if (param.ownerDocument().getSpecVersion() === "2.0") {
            if (param.in === "body") {
                st = SimplifiedType.fromSchema(param.schema);
            } else {
                st = SimplifiedType.fromItems(param as Oas20Parameter);
            }
        } else {
            st = SimplifiedType.fromSchema((param as Oas30Parameter).schema);
        }

        rval.type = st.type;
        rval.enum = st.enum;
        rval.of = st.of;
        rval.as = st.as;
        rval.required = param.required;

        return rval;
    }

    required: boolean;

}


export class SimplifiedPropertyType extends SimplifiedType {

    public static fromPropertySchema(schema: Oas20PropertySchema | Oas30PropertySchema): SimplifiedPropertyType {
        let rval: SimplifiedPropertyType = new SimplifiedPropertyType();

        let propName: string = schema.propertyName();
        let required: string[] = schema.parent()["required"];

        let st: SimplifiedType = SimplifiedType.fromSchema(schema);
        rval.type = st.type;
        rval.enum = st.enum;
        rval.of = st.of;
        rval.as = st.as;
        rval.required = false;
        if (required && required.length > 0 && required.indexOf(propName) != -1) {
            rval.required = true;
        }

        return rval;
    }

    required: boolean;

}
