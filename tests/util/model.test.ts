///<reference path="../../node_modules/@types/jasmine/index.d.ts"/>
///<reference path="../../tests/@types/karma-read-json/index.d.ts"/>
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

import {ModelUtils} from "../../src/util/model.util";

describe("ModelUtils Test", () => {

    it("detectPathParamNames (no params)", () => {
        let params: string[] = ModelUtils.detectPathParamNames("/");
        expect(params).toEqual([]);

        params = ModelUtils.detectPathParamNames("/path/to/resource");
        expect(params).toEqual([]);

        params = ModelUtils.detectPathParamNames("/path/to/{resource");
        expect(params).toEqual([]);
    });

    it("detectPathParamNames (1 param)", () => {
        let params: string[] = ModelUtils.detectPathParamNames("/widgets/{widgetId}");
        expect(params).toEqual([ "widgetId" ]);

        params = ModelUtils.detectPathParamNames("/widgets/{ widgetId }");
        expect(params).toEqual([ "widgetId" ]);

        params = ModelUtils.detectPathParamNames("/resources/widgets/{widgetId}");
        expect(params).toEqual([ "widgetId" ]);

        params = ModelUtils.detectPathParamNames("/{rootSegment}/widgets");
        expect(params).toEqual([ "rootSegment" ]);

        params = ModelUtils.detectPathParamNames("/widgets/allWidget.{type}");
        expect(params).toEqual([ "type" ]);
    });

    it("detectPathParamNames (multiple params)", () => {
        let params: string[] = ModelUtils.detectPathParamNames("/widgets/{widgetId}/foos/{fooId}");
        expect(params).toEqual([ "widgetId", "fooId" ]);

        params = ModelUtils.detectPathParamNames("/widgets/{widgetId}/{ action}");
        expect(params).toEqual([ "widgetId", "action" ]);

        params = ModelUtils.detectPathParamNames("/{rootSegment}/widgets/{widgetId}/foos/{fooId}/resources/{resourceId}/{assetType}");
        expect(params).toEqual([ "rootSegment", "widgetId", "fooId", "resourceId", "assetType" ]);

        params = ModelUtils.detectPathParamNames("/widgets/{widgetId}/download.{type}");
        expect(params).toEqual([ "widgetId", "type" ]);

        params = ModelUtils.detectPathParamNames("/repository/{repoName}/{file}.{extension}");
        expect(params).toEqual([ "repoName", "file", "extension" ]);

        params = ModelUtils.detectPathParamNames("/repository/{repoName}/paths/{path}/{file}.{extension}");
        expect(params).toEqual([ "repoName", "path", "file", "extension" ]);

    });

});
