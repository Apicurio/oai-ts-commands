A typescript library for mutating data models created using the oai-ts-core
library.

Install with `npm install oai-ts-commands`.

## Overview

You can use this library to mutate an OpenAPI document.

## Quickstart

The easiest way to get started is to create an instance of a command
and execute it:

_Typescript:_

```Typescript
// Get the OpenAPI document from somewhere (can be a string or js object).
let openApiData: any = ...;
// Create an instance of the library utils class and use it to parse the OpenAPI document.
let library: OasLibraryUtils = new OasLibraryUtils();
let document: Oas30Document = <Oas30Document> library.createDocument(openApiData);

// Mutate the document using one or more Command
let command: ICommand = new ChangePropertyCommand<string>("description", "New description goes here!", document.info);
command.execute(document);
```

_Browser (UMD):_

```JavaScript
// Get the OpenAPI document from somewhere (can be a string or js object).
var openApiData = ...; // Get your OpenAPI data somehow (can be string or JS object)
// Create an instance of the library utils class and use it to parse the OpenAPI document.
var library = new OAI.OasLibraryUtils();
var document = library.createDocument(openApiData);

// Mutate the document using one or more Command
var command = new ChangePropertyCommand("description", "New description goes here!", document.info);
command.execute(document);
```
