/**
 * @license
 * Copyright 2018 JBoss Inc
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
import {AbstractCommand, ICommand} from "../base";
import {MarshallUtils} from "../util/marshall.util";

/**
 * Factory function.
 * @param name
 * @param commands
 */
export function createAggregateCommand(name: string, info: any, commands: ICommand[]): AggregateCommand {
    let command: AggregateCommand = new AggregateCommand(name, info, commands);
    return command;
}

/**
 * A command used to aggregate an array of other commands into a single logical command.  This is used
 * for example to make multiple changes as a single "undoable" change.
 */
export class AggregateCommand extends AbstractCommand implements ICommand {

    public name: string;
    public info: any;
    protected _commands: ICommand[];

    /**
     * Constructor.
     * @param name
     * @param commands
     */
    constructor(name: string, info: any, commands: ICommand[]) {
        super();
        this.name = name;
        this.info = info;
        this._commands = commands;
    }

    protected type(): string {
        return "AggregateCommand";
    }

    /**
     * Executes the command.
     * @param {OasDocument} document
     */
    public execute(document: OasDocument): void {
        console.info(`[AggregateCommand] Executing ${ this._commands.length } child commands.`);
        this._commands.forEach( command => {
            command.execute(document);
        });
    }

    /**
     * Undoes the command.
     * @param {OasDocument} document
     */
    public undo(document: OasDocument): void {
        console.info(`[AggregateCommand] Reverting ${ this._commands.length } child commands.`);
        this._commands.reverse().forEach( command => {
            command.undo(document);
        });
    }

    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    public marshall(): any {
        let obj: any = super.marshall();
        obj._commands = this._commands.map( childCommand => MarshallUtils.marshallCommand(childCommand));
        return obj;
    }

    /**
     * Unmarshall the JS object.
     * @param obj
     */
    public unmarshall(obj: any): void {
        super.unmarshall(obj);
        this._commands = (obj["_commands"] as any[]).map( childCommand => MarshallUtils.unmarshallCommand(childCommand));
    }

}
