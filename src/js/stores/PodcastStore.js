/*global window */
/*jslint node: true, browser: true */

var AppDispatcher = require('../dispatchers/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var SubscriptionsAction = require('../actions/SubscriptionsAction');

// var DriveAPI = require('../utils/DriveAPI');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = "change";

var _podcast = {
    podcastData: {},
    audios: []
};

var PodcastStore = assign({}, EventEmitter.prototype, {

    emitChange: function () {
        'use strict';
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        'use strict';
        this.on(CHANGE_EVENT, callback);
    },

    getPodcastInfo: function () {
        'use strict';
        return _podcast.podcastData;  
    },

    getAudios: function () {
        'use strict';
        return _podcast.audios;  
    }
});


PodcastStore.dispatchToken = AppDispatcher.register(function (action) {
    'use strict';

    var feedUrl, yql, xmlhttp, i;

    switch (action.actionType) {
    case AppConstants.SELECT_SUBSCRIPTION:
        
        feedUrl = action.item.url;
        yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url=\'' + feedUrl + '\'') + '&format=json&callback=';

        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {

            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {        
                var channel = JSON.parse(xmlhttp.responseText).query.results.rss.channel;
                _podcast.audios = channel.item;

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

                _podcast.podcastData = {
                    name: action.item.name,
                    author: channel.author,
                    imageUrl: imageUrl
                };


                PodcastStore.emitChange();

                // Check for podcast metadata updates
                if (action.item.thumbnail !== imageUrl) {
                    SubscriptionsAction.updateInfo({
                        podcastUrl: action.item.url,
                        podcastImage: imageUrl
                    });
                }


            }
        };

        xmlhttp.open("GET", yql, true);
        xmlhttp.send();

        break;

    default:
        // do nothing
    }

});


module.exports = PodcastStore;