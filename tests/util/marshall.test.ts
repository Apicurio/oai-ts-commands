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

import {MarshallUtils} from "../../src/util/marshall.util";
import {ICommand} from "../../src/base";

describe("Unmarshall Test", () => {

    it("Version Command", () => {
        let data: any = {__type: "ChangeVersionCommand_30", _newVersion: "13", _oldVersion: "12"};
        let cmd: ICommand = MarshallUtils.unmarshallCommand(data);
        expect(cmd).toBeTruthy();
        let marshalledData: any = MarshallUtils.marshallCommand(cmd);
        expect(marshalledData).toEqual(data);
    });

});

