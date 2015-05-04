/*jslint node: true, browser: true */

var AppDispatcher = require('../dispatchers/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var DriveAPI = require('../utils/DriveAPI');
var assign = require('object-assign');

var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = "change";

var _subscriptions;
var _subscriptionsTemp = [{
    'name': 'LODE (demo)',
    'url': 'http://www.ivoox.com/podcast-la-orbita-de-endor_fg_f113302_filtro_1.xml'
}];


var SubscriptionsStore = assign({}, EventEmitter.prototype, {

    emitChange: function () {
        'use strict';
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        'use strict';
        this.on(CHANGE_EVENT, callback);
    },

    getSubscriptions: function () {
        'use strict';
        return _subscriptions;  
    }
});


SubscriptionsStore.dispatchToken = AppDispatcher.register(function (action) {
    'use strict';

    var feedUrl, yql, xmlhttp, index;

    switch (action.actionType) {
    case AppConstants.REFRESH_SUBSCRIPTIONS:

        DriveAPI.subscribe('isAuthorized', function (isAuthorized) {
            if (isAuthorized === true) {
                DriveAPI.searchFile('subscriptions.json', function (response) {
                    if (response.length === 0) {
                        DriveAPI.createFile('subscriptions.json', _subscriptionsTemp, function () {
                            _subscriptions = _subscriptionsTemp;                            
                            SubscriptionsStore.emitChange();
                        });
                    } else if (response.length === 1) {
                        var idFile = response[0].id;
                        DriveAPI.readFile(idFile, function (content) {
                            _subscriptions = content;                           
                            SubscriptionsStore.emitChange();
                        });
                    } else {
                        console.log('Multiple subscriptions files', response);
                    }
                });
            }
        });

        break;

    case AppConstants.ADD_SUBSCRIPTION:

        feedUrl = action.item.url;
        yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url=\'' + feedUrl + '\'') + '&format=json&callback=';

        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {                 
                var channel = JSON.parse(xmlhttp.responseText).query.results.rss.channel;

                _subscriptions.push({
                    'name': channel.title,
                    'url': action.item.url
                });

                SubscriptionsStore.emitChange();

                DriveAPI.searchFile('subscriptions.json', function (response) {
                    if (response.length === 1) {
                        var idFile = response[0].id;
                        DriveAPI.updateFile(idFile, _subscriptions, function (updateResponse) {                    
                            console.log(updateResponse);
                        });
                    }                   
                });

            } 
        };

        xmlhttp.open("GET", yql, true);
        xmlhttp.send();

        break;

    case AppConstants.REMOVE_SUBSCRIPTION:
        index = _subscriptions.indexOf(action.item);
        if (index > -1) {
            _subscriptions.splice(index, 1);
        }       

        SubscriptionsStore.emitChange();

        DriveAPI.searchFile('subscriptions.json', function (response) {
            if (response.length === 1) {
                var idFile = response[0].id;
                DriveAPI.updateFile(idFile, _subscriptions, function (content) {                    
                    console.log(content);
                });
            }                   
        });

        break;

    default:
        // do nothing
    }

});

module.exports = SubscriptionsStore;