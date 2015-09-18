# sp-list-to-table
Get SharePoint list items' data as a table.

## Installation
```
npm install sp-list-to-table --save
```

## Usage
```js
var list2Table = require('sp-list-to-table');

var weburl = 'web url';
var listTitle = 'list title';
var include = 'Include(Title, Name)'; 
var useAppContextSite = false;

list2Table(webUrl, listTitle, include, useAppContextSite, function (table) {
    // Do something
}, function (sender, args) {
    // Error
}):
```

## License
MIT.
