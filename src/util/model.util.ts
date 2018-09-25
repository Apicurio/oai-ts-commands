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
