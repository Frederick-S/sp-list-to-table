# sp-list-to-table

[![Greenkeeper badge](https://badges.greenkeeper.io/Frederick-S/sp-list-to-table.svg)](https://greenkeeper.io/)
Get SharePoint list items' data as a table (An array of arrays).

## Installation
```
npm install sp-list-to-table --save
```

## Usage
```js
var list2Table = require('sp-list-to-table');

var webUrl = 'web url';
var listTitle = 'list title';
var camlQuery = new SP.CamlQuery();
var includes = ['Title', 'Name']; 
var useAppContextSite = false;

list2Table(webUrl, listTitle, camlQuery, includes, useAppContextSite, function (table) {
    // Do something
    // table[0] is an array of field names
    // table[1..n] is field values
}, function (sender, args) {
    // Error
}):
```

## License
MIT.
