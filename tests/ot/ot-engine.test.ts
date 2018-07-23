///<reference path="../../node_modules/@types/jasmine/index.d.ts"/>
///<reference path="../../tests/@types/karma-read-json/index.d.ts"/>
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

import {Oas30Operation, OasDocument, OasLibraryUtils} from "oai-ts-core";
import {OtEngine} from "../../src/ot/ot-engine";
import {OtCommand} from "../../src/ot/ot-command";
import {MarshallUtils} from "../../src/util/marshall.util";
import {ICommand} from "../../src/base";
import {createReplaceOperationCommand} from "../../src/commands/replace-operation.command";

let library: OasLibraryUtils = new OasLibraryUtils();


function loadCommand(path: string, contentVersion: number): OtCommand {
    let cmdJson: any = readJSON("tests/_fixtures/ot/" + path);
    let command: ICommand = MarshallUtils.unmarshallCommand(cmdJson);

    let rval: OtCommand = new OtCommand();
    rval.command = command;
    rval.contentVersion = contentVersion;
    return rval;
}


describe("OT Engine Test", () => {

    it("Single Command", () => {
        let startDocJs: any = readJSON("tests/_fixtures/ot/single-command/_start-document.json");
        expect(startDocJs).toBeTruthy();
        let startDoc: OasDocument = library.createDocument(startDocJs);
        let engine: OtEngine = new OtEngine(startDoc);
        engine.executeCommand(loadCommand("single-command/change-title.command.json", 1));
        let endDoc: OasDocument = engine.getCurrentDocument();

        let expected: any = readJSON("tests/_fixtures/ot/single-command/_end-document.json");
        let actual: any = library.writeNode(endDoc);

        expect(actual).toEqual(expected);
    });

    it("In Sequence", () => {
        let startDocJs: any = readJSON("tests/_fixtures/ot/in-sequence/_start-document.json");
        expect(startDocJs).toBeTruthy();
        let startDoc: OasDocument = library.createDocument(startDocJs);
        let engine: OtEngine = new OtEngine(startDoc);
        engine.executeCommand(loadCommand("in-sequence/change-title.command.json", 1));
        engine.executeCommand(loadCommand("in-sequence/change-description.command.json", 2));
        engine.executeCommand(loadCommand("in-sequence/change-version.command.json", 3));
        let endDoc: OasDocument = engine.getCurrentDocument();

        let expected: any = readJSON("tests/_fixtures/ot/in-sequence/_end-document.json");
        let actual: any = library.writeNode(endDoc);

        expect(actual).toEqual(expected);
    });

    it("In Sequence (Reverse)", () => {
        let startDocJs: any = readJSON("tests/_fixtures/ot/in-sequence/_start-document.json");
        expect(startDocJs).toBeTruthy();
        let startDoc: OasDocument = library.createDocument(startDocJs);
        let engine: OtEngine = new OtEngine(startDoc);
        engine.executeCommand(loadCommand("in-sequence/change-description.command.json", 2));
        engine.executeCommand(loadCommand("in-sequence/change-version.command.json", 3));
        engine.executeCommand(loadCommand("in-sequence/change-title.command.json", 1));
        let endDoc: OasDocument = engine.getCurrentDocument();

        let expected: any = readJSON("tests/_fixtures/ot/in-sequence/_end-document.json");
        let actual: any = library.writeNode(endDoc);

        expect(actual).toEqual(expected);
    });

    it("Order Matters (Rev 1)", () => {
        let startDocJs: any = readJSON("tests/_fixtures/ot/order-matters/_start-document.json");
        expect(startDocJs).toBeTruthy();
        let startDoc: OasDocument = library.createDocument(startDocJs);
        let engine: OtEngine = new OtEngine(startDoc);

        engine.executeCommand(loadCommand("order-matters/change-version.command.json", 1));
        engine.executeCommand(loadCommand("order-matters/change-title.command.json", 2));
        engine.executeCommand(loadCommand("order-matters/change-operationId.command.json", 3));
        engine.executeCommand(loadCommand("order-matters/replace-operation.command.json", 4));
        engine.executeCommand(loadCommand("order-matters/change-summary.command.json", 5));

        let endDoc: OasDocument = engine.getCurrentDocument();

        let expected: any = readJSON("tests/_fixtures/ot/order-matters/_end-document.json");
        let actual: any = library.writeNode(endDoc);

        expect(actual).toEqual(expected);
    });

    it("Order Matters (Rev 2)", () => {
        let startDocJs: any = readJSON("tests/_fixtures/ot/order-matters/_start-document.json");
        expect(startDocJs).toBeTruthy();
        let startDoc: OasDocument = library.createDocument(startDocJs);
        let engine: OtEngine = new OtEngine(startDoc);

        engine.executeCommand(loadCommand("order-matters/replace-operation.command.json", 4));
        engine.executeCommand(loadCommand("order-matters/change-title.command.json", 2));
        engine.executeCommand(loadCommand("order-matters/change-operationId.command.json", 3));
        engine.executeCommand(loadCommand("order-matters/change-summary.command.json", 5));
        engine.executeCommand(loadCommand("order-matters/change-version.command.json", 1));

        let endDoc: OasDocument = engine.getCurrentDocument();

        let expected: any = readJSON("tests/_fixtures/ot/order-matters/_end-document.json");
        let actual: any = library.writeNode(endDoc);

        expect(actual).toEqual(expected);
    });

    it("Order Matters (Rev 3)", () => {
        let startDocJs: any = readJSON("tests/_fixtures/ot/order-matters/_start-document.json");
        expect(startDocJs).toBeTruthy();
        let startDoc: OasDocument = library.createDocument(startDocJs);
        let engine: OtEngine = new OtEngine(startDoc);

        engine.executeCommand(loadCommand("order-matters/change-operationId.command.json", 3));
        engine.executeCommand(loadCommand("order-matters/change-summary.command.json", 5));
        engine.executeCommand(loadCommand("order-matters/change-version.command.json", 1));
        engine.executeCommand(loadCommand("order-matters/replace-operation.command.json", 4));
        engine.executeCommand(loadCommand("order-matters/change-title.command.json", 2));

        let endDoc: OasDocument = engine.getCurrentDocument();

        let expected: any = readJSON("tests/_fixtures/ot/order-matters/_end-document.json");
        let actual: any = library.writeNode(endDoc);

        expect(actual).toEqual(expected);
    });

    it("Pending Order Matters (Rev 1)", () => {
        let startDocJs: any = readJSON("tests/_fixtures/ot/pending-order-matters/_start-document.json");
        expect(startDocJs).toBeTruthy();
        let startDoc: OasDocument = library.createDocument(startDocJs);
        let engine: OtEngine = new OtEngine(startDoc);

        engine.executeCommand(loadCommand("pending-order-matters/change-version.command.json", 1), true);
        engine.finalizeCommand(1, 11);
        engine.executeCommand(loadCommand("pending-order-matters/change-title.command.json", 2), true);
        engine.finalizeCommand(2, 12);
        engine.executeCommand(loadCommand("pending-order-matters/change-operationId.command.json", 3), true);
        engine.finalizeCommand(3, 13);
        engine.executeCommand(loadCommand("pending-order-matters/replace-operation.command.json", 4), true);
        engine.finalizeCommand(4, 14);
        engine.executeCommand(loadCommand("pending-order-matters/change-summary.command.json", 5), true);
        engine.finalizeCommand(5, 15);

        let endDoc: OasDocument = engine.getCurrentDocument();

        let expected: any = readJSON("tests/_fixtures/ot/pending-order-matters/_end-document.json");
        let actual: any = library.writeNode(endDoc);

        expect(actual).toEqual(expected);
    });

    it("Pending Order Matters (Rev 2)", () => {
        let startDocJs: any = readJSON("tests/_fixtures/ot/pending-order-matters/_start-document.json");
        expect(startDocJs).toBeTruthy();
        let startDoc: OasDocument = library.createDocument(startDocJs);
        let engine: OtEngine = new OtEngine(startDoc);

        engine.executeCommand(loadCommand("pending-order-matters/change-version.command.json", 1), true);
        engine.executeCommand(loadCommand("pending-order-matters/change-title.command.json", 2), true);
        engine.executeCommand(loadCommand("pending-order-matters/change-operationId.command.json", 3), true);
        engine.finalizeCommand(1, 11);
        engine.finalizeCommand(2, 12);
        engine.executeCommand(loadCommand("pending-order-matters/replace-operation.command.json", 4), true);
        engine.executeCommand(loadCommand("pending-order-matters/change-summary.command.json", 5), true);
        engine.finalizeCommand(3, 13);
        engine.finalizeCommand(4, 14);
        engine.finalizeCommand(5, 15);

        let endDoc: OasDocument = engine.getCurrentDocument();

        let expected: any = readJSON("tests/_fixtures/ot/pending-order-matters/_end-document.json");
        let actual: any = library.writeNode(endDoc);

        expect(actual).toEqual(expected);
    });

    it("Pending Order Matters (Rev 3)", () => {
        let startDocJs: any = readJSON("tests/_fixtures/ot/pending-order-matters/_start-document.json");
        expect(startDocJs).toBeTruthy();
        let startDoc: OasDocument = library.createDocument(startDocJs);
        let engine: OtEngine = new OtEngine(startDoc);

        engine.executeCommand(loadCommand("pending-order-matters/change-version.command.json", 1), true);
        engine.executeCommand(loadCommand("pending-order-matters/change-title.command.json", 2), true);
        engine.executeCommand(loadCommand("pending-order-matters/change-operationId.command.json", 3), true);
        engine.executeCommand(loadCommand("pending-order-matters/replace-operation.command.json", 4), true);
        engine.executeCommand(loadCommand("pending-order-matters/change-summary.command.json", 5), true);
        engine.finalizeCommand(3, 13);
        engine.finalizeCommand(1, 11);
        engine.finalizeCommand(5, 15);
        engine.finalizeCommand(2, 12);
        engine.finalizeCommand(4, 14);

        let endDoc: OasDocument = engine.getCurrentDocument();

        let expected: any = readJSON("tests/_fixtures/ot/pending-order-matters/_end-document.json");
        let actual: any = library.writeNode(endDoc);

        expect(actual).toEqual(expected);
    });

    it("Pending Order Matters (Rev 4)", () => {
        let startDocJs: any = readJSON("tests/_fixtures/ot/pending-order-matters/_start-document.json");
        expect(startDocJs).toBeTruthy();
        let startDoc: OasDocument = library.createDocument(startDocJs);
        let engine: OtEngine = new OtEngine(startDoc);

        engine.executeCommand(loadCommand("pending-order-matters/change-version.command.json", 1), true);
        engine.finalizeCommand(1, 11);
        engine.executeCommand(loadCommand("pending-order-matters/change-title.command.json", 2), true);
        engine.finalizeCommand(2, 12);
        engine.executeCommand(loadCommand("pending-order-matters/change-operationId.command.json", 3), true);
        engine.executeCommand(loadCommand("pending-order-matters/replace-operation.command.json", 14));
        engine.executeCommand(loadCommand("pending-order-matters/change-summary.command.json", 15));
        engine.finalizeCommand(3, 13);

        let endDoc: OasDocument = engine.getCurrentDocument();

        let expected: any = readJSON("tests/_fixtures/ot/pending-order-matters/_end-document.json");
        let actual: any = library.writeNode(endDoc);

        expect(actual).toEqual(expected);
    });

    it("Simple Undo", () => {
        let startDocJs: any = readJSON("tests/_fixtures/ot/simple-undo/_start-document.json");
        expect(startDocJs).toBeTruthy();
        let startDoc: OasDocument = library.createDocument(startDocJs);
        let engine: OtEngine = new OtEngine(startDoc);
        engine.executeCommand(loadCommand("simple-undo/change-title.command.json", 1));
        engine.executeCommand(loadCommand("simple-undo/change-description.command.json", 2));
        engine.executeCommand(loadCommand("simple-undo/change-version.command.json", 3));
        engine.undo(3);
        let endDoc: OasDocument = engine.getCurrentDocument();

        let expected: any = readJSON("tests/_fixtures/ot/simple-undo/_end-document.json");
        let actual: any = library.writeNode(endDoc);

        expect(actual).toEqual(expected);
    });

    it("Undo Pending", () => {
        let startDocJs: any = readJSON("tests/_fixtures/ot/undo-pending/_start-document.json");
        expect(startDocJs).toBeTruthy();
        let startDoc: OasDocument = library.createDocument(startDocJs);
        let engine: OtEngine = new OtEngine(startDoc);
        engine.executeCommand(loadCommand("undo-pending/change-title.command.json", 1), true);
        engine.finalizeCommand(1, 11);
        engine.executeCommand(loadCommand("undo-pending/change-description.command.json", 2), true);
        engine.finalizeCommand(2, 12);
        engine.executeCommand(loadCommand("undo-pending/change-version.command.json", 3), true);
        engine.undoLastLocalCommand();
        engine.finalizeCommand(3, 13);
        let endDoc: OasDocument = engine.getCurrentDocument();

        let expected: any = readJSON("tests/_fixtures/ot/undo-pending/_end-document.json");
        let actual: any = library.writeNode(endDoc);

        expect(actual).toEqual(expected);
    });

    it("Undo Pending (Late Finalize)", () => {
        let startDocJs: any = readJSON("tests/_fixtures/ot/undo-pending/_start-document.json");
        expect(startDocJs).toBeTruthy();
        let startDoc: OasDocument = library.createDocument(startDocJs);
        let engine: OtEngine = new OtEngine(startDoc);
        engine.executeCommand(loadCommand("undo-pending/change-title.command.json", 1), true);
        engine.executeCommand(loadCommand("undo-pending/change-description.command.json", 2), true);
        engine.executeCommand(loadCommand("undo-pending/change-version.command.json", 3), true);
        engine.undoLastLocalCommand();
        engine.finalizeCommand(1, 11);
        engine.finalizeCommand(2, 12);
        engine.finalizeCommand(3, 13);
        let endDoc: OasDocument = engine.getCurrentDocument();

        let expected: any = readJSON("tests/_fixtures/ot/undo-pending/_end-document.json");
        let actual: any = library.writeNode(endDoc);

        expect(actual).toEqual(expected);
    });

    it("Undo Pending (Out of Order Finalize)", () => {
        let startDocJs: any = readJSON("tests/_fixtures/ot/undo-pending/_start-document.json");
        expect(startDocJs).toBeTruthy();
        let startDoc: OasDocument = library.createDocument(startDocJs);
        let engine: OtEngine = new OtEngine(startDoc);
        engine.executeCommand(loadCommand("undo-pending/change-title.command.json", 1), true);
        engine.executeCommand(loadCommand("undo-pending/change-description.command.json", 2), true);
        engine.executeCommand(loadCommand("undo-pending/change-version.command.json", 3), true);
        engine.undoLastLocalCommand();
        engine.finalizeCommand(2, 12);
        engine.finalizeCommand(3, 13);
        engine.finalizeCommand(1, 11);
        let endDoc: OasDocument = engine.getCurrentDocument();

        let expected: any = readJSON("tests/_fixtures/ot/undo-pending/_end-document.json");
        let actual: any = library.writeNode(endDoc);

        expect(actual).toEqual(expected);
    });

    it("Mixed Undo", () => {
        let startDocJs: any = readJSON("tests/_fixtures/ot/mixed-undo/_start-document.json");
        expect(startDocJs).toBeTruthy();
        let startDoc: OasDocument = library.createDocument(startDocJs);
        let engine: OtEngine = new OtEngine(startDoc);
        engine.executeCommand(loadCommand("mixed-undo/change-title.command.json", 1), true);
        engine.executeCommand(loadCommand("mixed-undo/change-title-remote.command.json", 10));
        engine.finalizeCommand(1, 11);
        engine.executeCommand(loadCommand("mixed-undo/change-description-remote.command.json", 12));
        engine.executeCommand(loadCommand("mixed-undo/change-description.command.json", 2), true);
        engine.finalizeCommand(2, 13);
        engine.executeCommand(loadCommand("mixed-undo/change-version-remote.command.json", 14));
        engine.executeCommand(loadCommand("mixed-undo/change-version.command.json", 3), true);
        engine.finalizeCommand(3, 15);

        engine.undoLastLocalCommand();
        engine.undo(12);

        let endDoc: OasDocument = engine.getCurrentDocument();

        let expected: any = readJSON("tests/_fixtures/ot/mixed-undo/_end-document.json");
        let actual: any = library.writeNode(endDoc);

        expect(actual).toEqual(expected);
    });

    it("Simple Redo", () => {
        let startDocJs: any = readJSON("tests/_fixtures/ot/simple-redo/_start-document.json");
        expect(startDocJs).toBeTruthy();
        let startDoc: OasDocument = library.createDocument(startDocJs);
        let engine: OtEngine = new OtEngine(startDoc);
        engine.executeCommand(loadCommand("simple-redo/change-title.command.json", 1));
        engine.executeCommand(loadCommand("simple-redo/change-description.command.json", 2));
        engine.executeCommand(loadCommand("simple-redo/change-version.command.json", 3));
        engine.undo(3);
        engine.undo(2);
        engine.redo(2);
        let endDoc: OasDocument = engine.getCurrentDocument();

        let expected: any = readJSON("tests/_fixtures/ot/simple-redo/_end-document.json");
        let actual: any = library.writeNode(endDoc);

        expect(actual).toEqual(expected);
    });


    it("Simple Redo (Extra)", () => {
        let startDocJs: any = readJSON("tests/_fixtures/ot/simple-redo/_start-document.json");
        expect(startDocJs).toBeTruthy();
        let startDoc: OasDocument = library.createDocument(startDocJs);
        let engine: OtEngine = new OtEngine(startDoc);
        engine.executeCommand(loadCommand("simple-redo/change-title.command.json", 1), true);
        engine.executeCommand(loadCommand("simple-redo/change-description.command.json", 2), true);
        engine.executeCommand(loadCommand("simple-redo/change-version.command.json", 3), true);
        engine.finalizeCommand(1, 11);
        engine.finalizeCommand(2, 12);
        engine.finalizeCommand(3, 13);

        // Undo change-version
        let otcmd: OtCommand = engine.undoLastLocalCommand();
        expect(otcmd.contentVersion).toEqual(13);
        // Undo change-description
        otcmd = engine.undoLastLocalCommand();
        expect(otcmd.contentVersion).toEqual(12);
        // Undo change-title
        otcmd = engine.undoLastLocalCommand();
        expect(otcmd.contentVersion).toEqual(11);
        // Nothing to undo
        otcmd = engine.undoLastLocalCommand();
        expect(otcmd).toBeNull();
        // Redo change-title
        otcmd = engine.redoLastLocalCommand();
        expect(otcmd.contentVersion).toEqual(11);
        // Redo change-description
        otcmd = engine.redoLastLocalCommand();
        expect(otcmd.contentVersion).toEqual(12);
        // Redo change-version
        otcmd = engine.redoLastLocalCommand();
        expect(otcmd.contentVersion).toEqual(13);
        // Nothing to redo
        otcmd = engine.redoLastLocalCommand();
        expect(otcmd).toBeNull();
        // Nothing to redo
        otcmd = engine.redoLastLocalCommand();
        expect(otcmd).toBeNull();
        // Undo change-version
        otcmd = engine.undoLastLocalCommand();
        expect(otcmd.contentVersion).toEqual(13);

        let endDoc: OasDocument = engine.getCurrentDocument();

        let expected: any = readJSON("tests/_fixtures/ot/simple-redo/_end-document.json");
        let actual: any = library.writeNode(endDoc);

        expect(actual).toEqual(expected);
    });

    it("Mixed Redo", () => {
        let startDocJs: any = readJSON("tests/_fixtures/ot/mixed-redo/_start-document.json");
        expect(startDocJs).toBeTruthy();
        let startDoc: OasDocument = library.createDocument(startDocJs);
        let engine: OtEngine = new OtEngine(startDoc);
        engine.executeCommand(loadCommand("mixed-redo/change-title.command.json", 1), true);
        engine.finalizeCommand(1, 10);
        engine.executeCommand(loadCommand("mixed-redo/change-title-remote.command.json", 11));
        engine.executeCommand(loadCommand("mixed-redo/change-description.command.json", 2), true);
        engine.finalizeCommand(2, 12);
        engine.executeCommand(loadCommand("mixed-redo/change-description-remote.command.json", 13));
        engine.executeCommand(loadCommand("mixed-redo/change-version.command.json", 3), true);
        engine.finalizeCommand(3, 14);
        engine.executeCommand(loadCommand("mixed-redo/change-version-remote.command.json", 15));

        engine.undoLastLocalCommand();
        engine.undo(15);
        engine.undoLastLocalCommand();
        engine.undo(13);
        engine.redoLastLocalCommand();
        engine.redo(13);

        let endDoc: OasDocument = engine.getCurrentDocument();

        let expected: any = readJSON("tests/_fixtures/ot/mixed-redo/_end-document.json");
        let actual: any = library.writeNode(endDoc);

        expect(actual).toEqual(expected);
    });

});

