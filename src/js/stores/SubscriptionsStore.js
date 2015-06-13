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

function getChannelImage(channel) {
    var imageUrl = "";
    if (channel.hasOwnProperty('thumbnail')) {
        imageUrl = channel.thumbnail.url;
    } else {
        if (channel.image) {
            var urlImage = null;
            var hrefImage = null;
            if (Array.isArray && Array.isArray(channel.image)) {

                var numImage = channel.image.length;
                for (i = 0; i < numImage; i += 1) {
                    if (channel.image[i].hasOwnProperty('url')) {
                        urlImage = channel.image[i].url;
                    } else if (channel.image[i].hasOwnProperty('href')) {
                        hrefImage = channel.image[i].href;
                    }
                }
            } else if (channel.image[i].hasOwnProperty('url')) {
                urlImage = channel.image[i].url;
            } else if (channel.image[i].hasOwnProperty('href')) {
                hrefImage = channel.image[i].href;                            
            }
            imageUrl = hrefImage || urlImage;
        } 
    }
    return imageUrl;
}

SubscriptionsStore.dispatchToken = AppDispatcher.register(function (action) {
    'use strict';

    var feedUrl, yql, xmlhttp, index, numSubscriptions, i;

    switch (action.actionType) {
    case AppConstants.RELOAD_SUBSCRIPTIONS:

        DriveAPI.subscribe('isAuthorized', function (isAuthorized) {
            if (isAuthorized === true) {
                DriveAPI.searchFile('subscriptions.json', function (response) {
                    if (response.length === 0) {
                        DriveAPI.createFile('subscriptions.json', [], function () {
                            _subscriptions = [];
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

        var xhr = new XMLHttpRequest();
        xhr.open('GET', yql);
        xhr.onload = function() {
            var channel = JSON.parse(xhr.responseText).query.results.rss.channel;

            _subscriptions.push({
                'name': channel.title,
                'url': action.item.url,
                'thumbnail': getChannelImage(channel),
                'lastPublicationHash': encodeURIComponent(channel.item[0].enclosure.url),
                'unplayed': 0
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
        };
        xhr.send();
        break;

    case AppConstants.REFRESH_SUBSCRIPTIONS:
        console.log('REFRESH');

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

    case AppConstants.UPDATE_SUBSCRIPTION_INFO:

        numSubscriptions = _subscriptions.length;
        for (i = 0; i < numSubscriptions; i += 1) {
            if (_subscriptions[i].url === action.item.podcastUrl) {
                _subscriptions[i].thumbnail = action.item.podcastImage;
            }
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