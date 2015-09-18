var each = require('sp-each');
var contextHelper = require('sp-context-helper');

var keys = function (obj) {
    var keysArray = [];

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            keysArray.push(key);
        }
    }

    return keysArray;
}

var contains = function (array, value) {
    for (var i = 0, length = array.length; i < length; i++) {
        if (array[i] === value) {
            return true;
        }
    }

    return false;
}

function list2Table(webUrl, listTitle, camlQuery, includes, useAppContextSite, done, error) {
    var contextWrapper = contextHelper(webUrl, useAppContextSite);
    var web = contextWrapper.web;
    var clientContext = contextWrapper.clientContext;
    var list = web.get_lists().getByTitle(listTitle);
    var listItems = list.getItems(camlQuery);

    clientContext.load(listItems, 'Include(FieldValuesAsText)');
    clientContext.executeQueryAsync(function () {
        var table = [];

        each(listItems, function (current, index) {
            var fieldValues = current.get_fieldValuesAsText().get_fieldValues();

            if (index === 0) {
                if (includes.length === 0) {
                    table.push(keys(fieldValues));
                } else {
                    table.push(includes);
                }
            }

            var row = [];

            if (includes.length === 0) {
                for (var key in fieldValues) {
                    if (fieldValues.hasOwnProperty(key)) {
                        row.push(fieldValues[key]);
                    }
                }
            } else {
                for (var i = 0, length = includes.length; i < length; i++) {
                    row.push(fieldValues[includes[i]]);
                }
             }

            table.push(row);
        });

        done(table);
    }, error);
}

module.exports = list2Table;
