/*global window */
/*jslint node: true, browser: true */

var AppDispatcher = require('../dispatchers/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

// var DriveAPI = require('../utils/DriveAPI');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = "change";

var _audios = [];

var AudiosStore = assign({}, EventEmitter.prototype, {

    emitChange: function () {
        'use strict';
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        'use strict';
        this.on(CHANGE_EVENT, callback);
    },

    getAudios: function () {
        'use strict';
        return _audios;  
    }
});


AudiosStore.dispatchToken = AppDispatcher.register(function (action) {
    'use strict';

    var feedUrl, yql, xmlhttp;

    switch (action.actionType) {
    case AppConstants.SELECT_SUBSCRIPTION:
        
        feedUrl = action.item.url;
        yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url=\'' + feedUrl + '\'') + '&format=json&callback=';

        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {                 
                _audios = JSON.parse(xmlhttp.responseText).query.results.rss.channel.item;
                AudiosStore.emitChange();
            }
        };

        xmlhttp.open("GET", yql, true);
        xmlhttp.send();

        break;

    default:
        // do nothing
    }

});


module.exports = AudiosStore;