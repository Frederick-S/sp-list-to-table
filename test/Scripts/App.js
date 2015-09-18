/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var SPDummyListItemsCreation = __webpack_require__(1);
	var list2Table = __webpack_require__(2);

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


/***/ },
/* 1 */
/***/ function(module, exports) {

	function SPDummyListItemsCreation(webUrl, listTitle, crossSite) {
	    var web = null;
	    var appContextSite = null;
	    this.clientContext = null;

	    if (crossSite) {
	        this.clientContext = SP.ClientContext.get_current();
	        appContextSite = new SP.AppContextSite(clientContext, webUrl);
	        web = appContextSite.get_web();
	    } else {
	        this.clientContext = new SP.ClientContext(webUrl);
	        web = this.clientContext.get_web();
	    }

	    this.list = web.get_lists().getByTitle(listTitle);
	}

	SPDummyListItemsCreation.prototype.create = function (fieldValues, count, successHandler, errorHandler) {
	    for (var i = 0; i < count; i++) {
	        var listItemCreateInfo = new SP.ListItemCreationInformation();
	        var listItem = this.list.addItem(listItemCreateInfo);

	        for (var fieldName in fieldValues) {
	            if (fieldValues.hasOwnProperty(fieldName)) {
	                listItem.set_item(fieldName, fieldValues[fieldName]);
	            }
	        }

	        listItem.update();
	        this.clientContext.load(listItem);
	    }

	    this.clientContext.executeQueryAsync(successHandler, errorHandler);
	};

	module.exports = SPDummyListItemsCreation;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var each = __webpack_require__(3);
	var contextHelper = __webpack_require__(4);

	var keys = function (obj) {
	    var keysArray = [];

	    for (var key in obj) {
	        if (obj.hasOwnProperty(key)) {
	            keysArray.push(key);
	        }
	    }

	    return keysArray;
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	var spEach = function (collection, iteratee, context) {
	    if (typeof collection.getEnumerator === 'function') {
	        var index = 0;
	        var current = null;
	        var enumerator = collection.getEnumerator();

	        while (enumerator.moveNext()) {
	            current = enumerator.get_current();

	            iteratee.call(context, current, index, collection);

	            index++;
	        }
	    }
	};

	module.exports = spEach;


/***/ },
/* 4 */
/***/ function(module, exports) {

	function contextHelper(webUrl, crossSite) {
	    var web = null;
	    var site = null;
	    var clientContext = null;
	    var appContextSite = null;

	    if (crossSite) {
	        clientContext = SP.ClientContext.get_current();
	        appContextSite = new SP.AppContextSite(clientContext, webUrl);
	        web = appContextSite.get_web();
	        site = appContextSite.get_site();
	    } else {
	        clientContext = new SP.ClientContext(webUrl);
	        web = clientContext.get_web();
	        site = clientContext.get_site();
	    }

	    return {
	        web: web,
	        site: site,
	        clientContext: clientContext,
	        appContextSite: appContextSite
	    };
	}

	module.exports = contextHelper;

/***/ }
/******/ ]);