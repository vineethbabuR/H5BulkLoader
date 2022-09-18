# H5BulkLoader
H5 Utility to load bulk dataset to M3 

# H5BulkLoader 
Infor M3 JavaScript extension to load large dataset via H5 grid

## Features
* Modal dialog panel with a rendered HTML of H5Dialog
* Activated on any panel via a shortcut
* Transactions are loaded to the bulk api endpoint
* No need for OAuth token key authentication since user is authenticated in H5 grid
* API and Transaction name are inferred from the load file
* Errors are propagated back to the modal dialog panel

## Latest Versions
* JavaScript with ES6
  * The latest version is built using JavaScript and not the transpiled ES5 JavaScript from TypeScript.
  * There is a risk in developing extensions using JavaScript alone, as the editors do not provide intellisense and build time type safety without a tsconfig and infor typefiles
  * Editor intellisense and build time checks can be achieved by ES6 module imports for H5 framework, details of which are provided in a new repository below.  
	Download the pre-alpha [release here][1].

## Installation
Upload the .js file using H5 Adminstration and add a shortcut to the panel of choice.

## Usage
 
* click the shortcut to acticate the modal panel [BulkLoader Modal](https://user-images.githubusercontent.com/13961736/190909720-d60573d2-bdaf-4cbd-8187-c0f17da9182d.JPG), 
* click on Load JSON to call up the JSON file from file system. API, Transaction Name and Number of records will be inferred from the json file [BulkLoader API-Transaction-Record](https://user-images.githubusercontent.com/13961736/190910769-deda8916-b2dc-447a-ab3c-7fe185646fb9.JPG)
* clik OK to submit the payload and results will be propagated back to the form [BulkLoader Result](https://user-images.githubusercontent.com/13961736/190910890-298affa8-3e52-4829-8b7b-baeb6ece8b6d.JPG)
* click Cancel to cancel the operation



## Disclaimer
This is currently a work in progress and there will be incremental updates and fixes along the way

  [1]: https://github.com/vineethbabuR/H5Framework
