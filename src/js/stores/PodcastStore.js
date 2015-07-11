/*global window */
/*jslint node: true, browser: true */

var AppDispatcher = require('../dispatchers/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var SubscriptionsAction = require('../actions/SubscriptionsAction');

// var DriveAPI = require('../utils/DriveAPI');
var ImageUtils = require('../utils/ImageUtils');

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

        fetch(yql).then(function(response) { 

            response.json().then(function(data) { 

                var channel = data.query.results.rss.channel;
                _podcast.audios = channel.item;

                var channelImage = ImageUtils.getChannelImage(channel);

                _podcast.podcastData = {
                    name: action.item.name,
                    author: channel.author,
                    imageUrl: channelImage
                };


                PodcastStore.emitChange();

                // Check for podcast metadata updates
                if (action.item.channelImage !== channelImage) {
                    ImageUtils.resizeImageSrc(channelImage, 50, 50).then(function(response) {
                        SubscriptionsAction.updateInfo({
                            podcastUrl: action.item.url,
                            podcastThumbnail: response,
                            podcastImage: channelImage
                        });
                    });
                }
            });
        }).catch(function(err) {
            console.log(err.message);
        });

        break;

    default:
        // do nothing
    }

});


module.exports = PodcastStore;