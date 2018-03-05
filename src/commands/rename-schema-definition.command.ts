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
import {
    Oas20AdditionalPropertiesSchema, Oas20AllOfSchema,
    Oas20Document, Oas20ItemsSchema, Oas20PropertySchema, Oas20SchemaDefinition, Oas30AdditionalPropertiesSchema,
    Oas30AllOfSchema,
    Oas30AnyOfSchema,
    Oas30Document, Oas30ItemsSchema, Oas30NotSchema, Oas30OneOfSchema,
    Oas30PropertySchema,
    Oas30SchemaDefinition,
    OasCombinedVisitorAdapter, OasDocument,
    OasNodePath, OasSchema,
    OasVisitorUtil
} from "oai-ts-core";
import {MarshallUtils} from "../util/marshall.util";

/**
 * Factory function.
 */
export function createRenameSchemaDefinitionCommand(document: OasDocument, oldName: string, newName: string): RenameSchemaDefinitionCommand {
    if (document.getSpecVersion() === "2.0") {
        return new RenameSchemaDefinitionCommand_20(oldName, newName);
    } else {
        return new RenameSchemaDefinitionCommand_30(oldName, newName);
    }
}

/**
 * A command used to rename a schema definition, along with all references to it.
 */
export abstract class RenameSchemaDefinitionCommand extends AbstractCommand implements ICommand {

    private _oldName: string;
    private _newName: string;
    private _references: OasNodePath[];

    /**
     * C'tor.
     * @param {string} pathItemName
     * @param obj
     */
    constructor(oldName: string, newName: any) {
        super();
        this._oldName = oldName;
        this._newName = newName;
    }

    /**
     * Convert a simple name to a reference.  This will be different for 2.0 vs. 3.0
     * data models.
     * @param {string} name
     * @return {string}
     */
    protected abstract _nameToReference(name: string): string;

    /**
     * Called to actually change the name of the schema definition.  This impl will vary
     * depending on the OAI data model version.  Returns true if the rename actually happened.
     * @return {boolean}
     * @private
     */
    protected abstract _renameSchemaDefinition(document: OasDocument, fromName: string, toName: string): boolean;

    /**
     * Adds the new pathItem to the document.
     * @param document
     */
    public execute(document: OasDocument): void {
        console.info("[RenameSchemaDefinitionCommand] Executing.");
        this._references = [];
        if (this._renameSchemaDefinition(document, this._oldName, this._newName)) {
            let oldRef: string = this._nameToReference(this._oldName);
            let newRef: string = this._nameToReference(this._newName);
            let schemaFinder: SchemaRefFinder = new SchemaRefFinder(oldRef);
            let schemas: OasSchema[] = schemaFinder.findIn(document);
            schemas.forEach( schema => {
                this._references.push(this.oasLibrary().createNodePath(schema));
                schema.$ref = newRef;
            });
        }
    }

    /**
     * Removes the pathItem.
     * @param document
     */
    public undo(document: OasDocument): void {
        console.info("[RenameSchemaDefinitionCommand] Reverting.");
        if (this._renameSchemaDefinition(document, this._newName, this._oldName)) {
            let oldRef: string = this._nameToReference(this._oldName);
            if (this._references) {
                this._references.forEach( ref => {
                    let schema: OasSchema = ref.resolve(document) as OasSchema;
                    schema.$ref = oldRef;
                });
            }
        }
    }

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._references = [];
        if (this._references) {
            this._references.forEach( refPath => {
                obj._references.push(MarshallUtils.marshallNodePath(refPath));
            })
        }
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._references = [];
        if (obj._references) {
            (<string[]>obj._references).forEach( refPathString => {
                this._references.push(MarshallUtils.unmarshallNodePath(refPathString));
            });
        }
    }

}

/**
 * The OAI 2.0 impl.
 */
export class RenameSchemaDefinitionCommand_20 extends RenameSchemaDefinitionCommand {

    protected _nameToReference(name: string): string {
        return "#/definitions/" + name;
    }

    protected _renameSchemaDefinition(document: Oas20Document, fromName: string, toName: string): boolean {
        if (!document.definitions) {
            return false;
        }
        if (document.definitions.definition(toName)) {
            return false;
        }
        let schemaDef: Oas20SchemaDefinition = document.definitions.removeDefinition(fromName);
        schemaDef["_definitionName"] = toName;
        document.definitions.addDefinition(toName, schemaDef);
        return true;
    }

    protected type(): string {
        return "RenameSchemaDefinitionCommand_20";
    }

}


/**
 * The OAI 3.0 impl.
 */
export class RenameSchemaDefinitionCommand_30 extends RenameSchemaDefinitionCommand {

    protected _nameToReference(name: string): string {
        return "#/components/schemas/" + name;
    }

    protected _renameSchemaDefinition(document: Oas30Document, fromName: string, toName: string): boolean {
        if (!document.components || !document.components.schemas) {
            return false;
        }
        if (document.components.schemas[toName]) {
            return false;
        }
        let schemaDef: Oas30SchemaDefinition = document.components.schemas[fromName];
        document.components.schemas[fromName] = null;
        delete document.components.schemas[fromName];
        schemaDef["_name"] = toName;
        document.components.schemas[toName] = schemaDef;
        return true;
    }

    protected type(): string {
        return "RenameSchemaDefinitionCommand_30";
    }

}


/**
 * Class used to find all schemas that reference a particular schema definition.
 */
export class SchemaRefFinder extends OasCombinedVisitorAdapter {
    private _reference: string;
    private _schemas: OasSchema[] = [];

    constructor(reference: string) {
        super();
        this._reference = reference;
    }

    public findIn(document: OasDocument): OasSchema[] {
        OasVisitorUtil.visitTree(document, this);
        return this._schemas;
    }

    protected _accept(schema: OasSchema): boolean {
        return schema.$ref && schema.$ref == this._reference;
    }

    protected processSchema(schema: OasSchema): void {
        if (this._accept(schema)) {
            this._schemas.push(schema);
        }
    }

    public visitSchema(node: OasSchema): void {
        this.processSchema(node);
    }
    public visitSchemaDefinition(node: Oas20SchemaDefinition | Oas30SchemaDefinition): void {
        this.processSchema(node);
    }
    public visitPropertySchema(node: Oas20PropertySchema | Oas30PropertySchema): void {
        this.processSchema(node);
    }
    public visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema | Oas30AdditionalPropertiesSchema): void {
        this.processSchema(node);
    }
    public visitAllOfSchema(node: Oas20AllOfSchema | Oas30AllOfSchema): void {
        this.processSchema(node);
    }
    public visitItemsSchema(node: Oas20ItemsSchema | Oas30ItemsSchema): void {
        this.processSchema(node);
    }
    public visitAnyOfSchema(node: Oas30AnyOfSchema): void {
        this.processSchema(node);
    }
    public visitOneOfSchema(node: Oas30OneOfSchema): void {
        this.processSchema(node);
    }
    public visitNotSchema(node: Oas30NotSchema): void {
        this.processSchema(node);
    }

}