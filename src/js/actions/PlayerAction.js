/*jslint node: true */

var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatchers/AppDispatcher');

var PodcastAction = {

    play: function () {
        'use strict';
        AppDispatcher.dispatch({
            actionType: AppConstants.PLAYER_PLAY
        });
    },
    pause: function () {
        'use strict';
        AppDispatcher.dispatch({
            actionType: AppConstants.PLAYER_PAUSE
        });
    },
    setTime: function (value) {
        'use strict';
        AppDispatcher.dispatch({
            actionType: AppConstants.PLAYER_SET_TIME,
            value: value
        });
    },
    setTimeReplay: function () {
        'use strict';
        AppDispatcher.dispatch({
            actionType: AppConstants.PLAYER_SET_TIME_REPLAY
        });
    },
    setTimeForward: function () {
        'use strict';
        AppDispatcher.dispatch({
            actionType: AppConstants.PLAYER_SET_TIME_FORWARD
        });
    },
    setVolume: function (value) {
        'use strict';
        AppDispatcher.dispatch({
            actionType: AppConstants.PLAYER_SET_VOLUME,
            value: value
        });
    },
    setPlaybackRate: function (value) {
        'use strict';
        AppDispatcher.dispatch({
            actionType: AppConstants.PLAYER_SET_PLAYBACK_RATE,
            value: value
        });
    },
    toogleCast: function () {
        'use strict';
        AppDispatcher.dispatch({
            actionType: AppConstants.PLAYER_TOOGLE_CAST
        });     
    }
};

module.exports = PodcastAction;