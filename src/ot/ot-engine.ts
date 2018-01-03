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

import {OasDocument} from "oai-ts-core";
import {OtCommand} from "./ot-command";


/**
 * This class is used to implement Operational Transformation support for OAI documents. For
 * reference:
 *
 * https://en.wikipedia.org/wiki/Operational_transformation
 *
 * Specifically, this implements a simple CC/CCI model, where changes to the document are
 * caused by executing commands against a document in a particular state.  This engine
 * ensures that commands are all executed in a consistent order.
 *
 * Note that all commands must have an "undo" operation that is integral to the proper
 * functioning of the OT algorithm.  The approach taken is to undo later commands when
 * inserting a command into a queue.  In other words, commands can be received and applied
 * asynchronously.  This can cause commands to be applied out of order.  When applying a
 * command out of order, it must be properly inserted into the command flow.  When this is
 * done, the document must be reverted to the proper state prior to executing the command.
 *
 * This is accomplished by "rewinding" the state of the document by invoking the "undo"
 * operation on all commands that have already been applied but temporally occur after the
 * command being inserted.  Once the document state has been rewound, the command being
 * inserted can be executed, and then all following commands can be executed.
 */
export class OtEngine {

    private pendingCommands: OtCommand[];
    private commands: OtCommand[];
    private document: OasDocument;

    /**
     * C'tor.
     * @param {OasDocument} document
     */
    constructor(document: OasDocument) {
        this.document = document;
        this.pendingCommands = [];
        this.commands = [];
    }

    /**
     * Gets the current document.
     * @return {OasDocument}
     */
    public getCurrentDocument(): OasDocument {
        return this.document;
    }

    /**
     * Returns true if there is at least one pending command in the engine.  A pending command is one
     * that has not yet been finalized.  This typically means that the command has been applied to
     * the local document but not persisted in some remote store.
     * @return {boolean}
     */
    public hasPendingCommands(): boolean {
        return this.pendingCommands.length > 0;
    }

    /**
     * Executes the given command in the correct sequence.  This command must have a valid
     * finalized contentVersion property.  This property will determine where in the sequence
     * of commands this one falls.  The engine will revert the document to an appropriate state
     * so that the command can be executed in the correct order.  During this process, existing
     * commands may need to be undone and then re-executed after.
     *
     * Here's what happens when executing a command:
     *
     * 1) "undo" all pending commands, since those are always executed last
     * 2) identify the insertion point of the command in the finalized command queue
     * 3) "undo" all finalized commands that fall AFTER this command in the finalized command queue
     * 4) execute this command and insert it into the finalized command queue
     * 5) re-execute all finalized commands that were undone in step #3
     * 6) re-execute all pending commands
     * 7) profit!
     *
     * A future optimization of this algorithm is to only undo/redo the commands that conflict
     * with this command.  This will avoid unnecessary work (why bother undoing/redoing when
     * there is no potential for a conflict in the document).  This optimization can be achieved
     * by ensuring that each command has a list of NodePaths that represent the affected parts of
     * the document tree.  These paths can be used to determine which commands conflict with
     * other commands.
     *
     * @param {OtCommand} command
     * @param {boolean} pending
     */
    public executeCommand(command: OtCommand, pending?: boolean): void {
        if (pending) {
            console.info("[OtEngine] Executing PENDING command with contentId: %s", command.contentVersion);
            command.command.execute(this.document);
            this.pendingCommands.push(command);
            return;
        }

        console.info("[OtEngine] Executing command with content version: %s", command.contentVersion);

        // Rewind any pending commands first.
        let pidx: number;
        for (pidx = this.pendingCommands.length - 1; pidx >= 0; pidx--) {
            this.pendingCommands[pidx].command.undo(this.document);
        }

        // Note: when finding the insertion point, search backwards since that will likely be the shortest trip

        // Find the insertion point of the new command (rewind any commands that should occur *after* the new command)
        let insertionIdx: number = this.commands.length - 1;
        if (this.commands.length > 0) {
            while (insertionIdx >= 0 && this.commands[insertionIdx].contentVersion > command.contentVersion) {
                this.commands[insertionIdx].command.undo(this.document);
                insertionIdx--;
            }
        }

        // Insert the new command into the correct location
        insertionIdx++;
        this.commands.splice(insertionIdx, 0, command);

        // Re-apply commands as necessary
        let idx: number = insertionIdx;
        while (idx < this.commands.length) {
            this.commands[idx].command.execute(this.document);
            idx++;
        }

        // Now re-apply any pending commands
        for (pidx = 0; pidx < this.pendingCommands.length; pidx++) {
            this.pendingCommands[pidx].command.execute(this.document);
        }
    }

    /**
     * Moves a commands from the "pending" queue to the "finalized" command queue.  This occurs
     * when a local (aka pending) command is acknowledged by the coordinating server and assigned
     * a final content version.  The engine must remove the command from the pending queue, update
     * its contentVersion, and then insert it at the correct location in the finalized queue.
     *
     * Here's what happens when finalizing a command:
     *
     * 1) "undo" all pending commands, shrinking the pending command queue to 0
     * 2) update the given pending command's contentVersion
     * 3) call "executeCommand()" with the newly finalized command
     * 4) re-execute all remaining pending commands
     *
     * @param {number} pendingCommandId
     * @param {number} finalizedContentVersion
     */
    public finalizeCommand(pendingCommandId: number, finalizedContentVersion: number): void {
        console.info("[OtEngine] Finalizing command with contentId: %d  and new contentVersion: %d", pendingCommandId, finalizedContentVersion);

        // Rewind all pending commands.
        let pidx: number;
        for (pidx = this.pendingCommands.length - 1; pidx >= 0; pidx--) {
            this.pendingCommands[pidx].command.undo(this.document);
        }

        // Temporarily detach the pending commands (so we don't undo them twice).
        let pending: OtCommand[] = this.pendingCommands;
        this.pendingCommands = [];

        // Locate the pending command being finalized
        let idx: number;
        let found: boolean = false;
        for (idx = 0; idx < pending.length; idx++) {
            if (pending[idx].contentVersion === pendingCommandId) {
                found = true;
                break;
            }
        }

        // If found, remove the pending command being finalized from the pending array
        if (found) {
            let command: OtCommand = pending[idx];
            pending.splice(idx, 1);
            command.contentVersion = finalizedContentVersion;

            this.executeCommand(command);
        } else {
            console.info("[OtEngine] Attempted to finalize pending command %d but was not found.", pendingCommandId);
        }

        // Now re-apply and restore all remaining pending commands (if any)
        this.pendingCommands = pending;
        for (let pidx = 0; pidx < this.pendingCommands.length; pidx++) {
            this.pendingCommands[pidx].command.execute(this.document);
        }

    }

}
