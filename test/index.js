var SPDummyListItemsCreation = require('sp-dummy-list-items');
var list2Table = require('../index.js');

var getQueryStringParameter = function (param) {
    var params = document.URL.split("?")[1].split("&");
    var strParams = "";

    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");

        if (singleParam[0] == param) {
            return decodeURIComponent(singleParam[1]);
        }
    }
};

var appWebUrl = getQueryStringParameter('SPAppWebUrl');
var listTitle = 'TestList';
var includes = [];
var camlQuery = new SP.CamlQuery();
var useAppContextSite = false;
var dummyListItemsCreation = new SPDummyListItemsCreation(appWebUrl, listTitle);

dummyListItemsCreation.create({
    'Title': 'Title',
    'Score': 100
}, 20, function (sender, args) {
    list2Table(appWebUrl, listTitle, camlQuery, includes, useAppContextSite, function (table) {
        $('#message').parent().html('<pre>' + JSON.stringify(table, null, 4) + '</pre>');
    }, function (sender, args) {
        $('#message').text(args.get_message());
    });
}, function (sender, args) {
    $('#message').text(args.get_message());
});
