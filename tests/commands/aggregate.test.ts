///<reference path="../../node_modules/@types/jasmine/index.d.ts"/>

/**
 * @license
 * Copyright 2016 JBoss Inc
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

import {commandTest} from "./_test-utils";
import {Oas30Document} from "oai-ts-core";
import {createChangeDescriptionCommand} from "../../src/commands/change-description.command";
import {ICommand} from "../../src/base";
import {createChangeTitleCommand} from "../../src/commands/change-title.command";
import {createAggregateCommand} from "../../src/commands/aggregate.command";
import {createDeleteContactCommand} from "../../src/commands/delete-contact.command";
import {createChangeContactCommand} from "../../src/commands/change-contact-info.command";


describe("Aggregate (3.0)", () => {

    it("Simple Aggregate", () => {
        commandTest(
            "tests/_fixtures/commands/aggregate/3.0/aggregate.before.json",
            "tests/_fixtures/commands/aggregate/3.0/aggregate.after.json",
            (document: Oas30Document) => {
                let changeDescription: ICommand = createChangeDescriptionCommand(document, "A new description for the API.");
                let changeTitle: ICommand = createChangeTitleCommand(document, "Updated Title API")
                let deleteContact: ICommand = createDeleteContactCommand(document);
                return createAggregateCommand("test-aggregate-3.0", null, [ changeDescription, changeTitle, deleteContact ]);
            }
        );
    });

    it("Aggregate (Order Matters)", () => {
        commandTest(
            "tests/_fixtures/commands/aggregate/3.0/aggregate-ordering.before.json",
            "tests/_fixtures/commands/aggregate/3.0/aggregate-ordering.after.json",
            (document: Oas30Document) => {
                let changeDescription1: ICommand = createChangeDescriptionCommand(document, "A new description for the API.");
                let changeDescription2: ICommand = createChangeDescriptionCommand(document, "Final description value.");
                let changeContact: ICommand = createChangeContactCommand(document, "NAME", "EMAIL@gmail.com", "http://url.com");
                let deleteContact: ICommand = createDeleteContactCommand(document);
                return createAggregateCommand("test-aggregate-3.0", null, [ changeDescription1, changeDescription2, changeContact, deleteContact ]);
            }
        );
    });

});
