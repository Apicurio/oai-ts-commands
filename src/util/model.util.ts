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
import {SimplifiedType} from "../models/simplified-type.model";
import {
    Oas20AdditionalPropertiesSchema,
    Oas20AllOfSchema,
    Oas20ItemsSchema,
    Oas20Parameter, Oas20ParameterBase, Oas20ParameterDefinition,
    Oas20PropertySchema,
    Oas20SchemaDefinition,
    Oas30AdditionalPropertiesSchema,
    Oas30AllOfSchema,
    Oas30ItemsSchema,
    Oas30Parameter, Oas30ParameterBase, Oas30ParameterDefinition,
    Oas30PropertySchema,
    Oas30SchemaDefinition,
    OasCombinedVisitorAdapter,
    OasSchema, OasVisitorUtil
} from "oai-ts-core";

export class ModelUtils {

    /**
     * Returns true if the given object is null or undefined.
     * @param object
     * @return {boolean}
     */
    public static isNullOrUndefined(object: any): boolean {
        return object === undefined || object === null;
    }

    /**
     * Detects the appropriate path parameter names from a path.  For example, if the
     * string "/resources/{fooId}/subresources/{barId}" is passed in, the following
     * string array will be returned:  [ "fooId", "barId" ]
     * @param path
     * @return
     */
    public static detectPathParamNames(path: string): string[] {
        let segments: string[] = path.split("/");
        let pnames: string[] = segments.filter(segment => {
            let startsWithOB: boolean = segment.charAt(0) === '{';
            let endsWithCB: boolean = segment.charAt(segment.length - 1) === '}';
            return startsWithOB && endsWithCB;
        }).map(segment => {
            return segment.substring(1, segment.length - 1);
        });
        return pnames;
    }

}


export class SimplifiedTypeUtil {

    public static setSimplifiedType(node: OasSchema | Oas20Parameter, type: SimplifiedType): void {
        node.$ref = null;
        node.type = null;
        node.enum = null;
        node.format = null;
        node.items = null;

        if (type.isSimpleType()) {
            node.type = type.type;
            node.format = type.as;
        }
        if (type.isEnum()) {
            node.enum = JSON.parse(JSON.stringify(type.enum));
        }
        if (type.isRef()) {
            node.$ref = type.type;
        }
        if (type.isArray()) {
            node.type = "array";
            let viz: SetItemsTypeVisitor = new SetItemsTypeVisitor(type);
            OasVisitorUtil.visitNode(node, viz);
        }
    }
}


export class SetItemsTypeVisitor extends OasCombinedVisitorAdapter {

    constructor(private type: SimplifiedType) { super(); }
    visitSchema(node: OasSchema): void {
        node.items = node.createItemsSchema();
        if (this.type.of) {
            if (this.type.of.isRef()) {
                node.items.$ref = this.type.of.type;
            } else {
                node.items.type = this.type.of.type;
                node.items.format = this.type.of.as;
            }
        }
    }
    visitParameterBase(node: Oas20ParameterBase | Oas30ParameterBase): void {
        if (node.ownerDocument().is2xDocument()) {
            let param: Oas20Parameter = node as Oas20Parameter;
            param.items = param.createItems();
            if (this.type.of) {
                param.items.type = this.type.of.type;
                param.items.format = this.type.of.as;
            }
        }
    }

    visitSchemaDefinition(node: Oas20SchemaDefinition | Oas30SchemaDefinition): void { this.visitSchema(node); }
    visitPropertySchema(node: Oas20PropertySchema | Oas30PropertySchema): void { this.visitSchema(node); }
    visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema | Oas30AdditionalPropertiesSchema): void { this.visitSchema(node); }
    visitAllOfSchema(node: Oas20AllOfSchema | Oas30AllOfSchema): void { this.visitSchema(node); }
    visitItemsSchema(node: Oas20ItemsSchema | Oas30ItemsSchema): void { this.visitSchema(node); }
    visitParameter(node: Oas20Parameter | Oas30Parameter): void { this.visitParameterBase(node); }
    visitParameterDefinition(node: Oas20ParameterDefinition | Oas30ParameterDefinition): void { this.visitParameterBase(node); }

}