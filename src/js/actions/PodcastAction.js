/*jslint node: true */

var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatchers/AppDispatcher');

var PodcastAction = {
    selectAudio: function (item) {
        'use strict';
        AppDispatcher.dispatch({
            actionType: AppConstants.PODCAST_SELECT_AUDIO,
            item: item
        });
    }
};

module.exports = PodcastAction;