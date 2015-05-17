/*jslint node: true */

var AppDispatcher = require('../dispatchers/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var EventEmitter = require('events').EventEmitter;


var _player = {
    volume: 100,
    time: 0,
    playback_rate: 1.0,
    audio_src: '',
    podcast_name: '',
    audio_title: '',
    audio_image: ''
};

var PLAY_EVENT = 'play',
    PAUSE_EVENT = 'pause',
    SET_TIME_EVENT = 'setTime',
    SET_TIME_REPLAY_EVENT = 'setTimeReplay',
    SET_TIME_REPLAY_FORWARD = 'setTimeForward',
    SET_VOLUME_EVENT = 'setvolume',
    SET_PLAYBACK_RATE_EVENT = 'setplaybackrate',
    TOOGLE_CAST_EVENT = 'tooglecast',
    CHANGE_SOURCE_EVENT = 'changesource';

var PlayerStore = assign({}, EventEmitter.prototype, {

    // PLAY EVENT
    emitPlay: function () { 'use strict'; this.emit(PLAY_EVENT);},
    addPlayListener: function (callback) { 'use strict'; this.on(PLAY_EVENT, callback);},
    // PAUSE EVENT
    emitPause: function () { 'use strict'; this.emit(PAUSE_EVENT);},
    addPauseListener: function (callback) { 'use strict'; this.on(PAUSE_EVENT, callback);},
    // SET_TIME EVENT
    emitSetTime: function () { 'use strict'; this.emit(SET_TIME_EVENT);},
    addSetTimeListener: function (callback) { 'use strict'; this.on(SET_TIME_EVENT, callback);},
    // SET_TIME_REPLAY EVENT
    emitSetTimeReplay: function () { 'use strict'; this.emit(SET_TIME_REPLAY_EVENT);},
    addSetTimeReplayListener: function (callback) { 'use strict'; this.on(SET_TIME_REPLAY_EVENT, callback);},
    // SET_TIME_FORWARD EVENT
    emitSetTimeForward: function () { 'use strict'; this.emit(SET_TIME_REPLAY_FORWARD);},
    addSetTimeForwardListener: function (callback) { 'use strict'; this.on(SET_TIME_REPLAY_FORWARD, callback);},
    // SET_VOLUME EVENT
    emitSetVolume: function () { 'use strict'; this.emit(SET_VOLUME_EVENT);},
    addSetVolumeListener: function (callback) { 'use strict'; this.on(SET_VOLUME_EVENT, callback);},
    // SET_PLAYBACK_RATE EVENT
    emitSetPlaybackRate: function () { 'use strict'; this.emit(SET_PLAYBACK_RATE_EVENT);},
    addSetPlaybackRateListener: function (callback) { 'use strict'; this.on(SET_PLAYBACK_RATE_EVENT, callback);},
    // TOOGLE_CAST EVENT
    emitToogleCast: function () { 'use strict'; this.emit(TOOGLE_CAST_EVENT);},
    addToogleCastListener: function (callback) { 'use strict'; this.on(TOOGLE_CAST_EVENT, callback);},
    // CHANGE_SOURCE EVENT
    emitChangeSource: function () { 'use strict'; this.emit(CHANGE_SOURCE_EVENT);},
    addChangeSourceListener: function (callback) { 'use strict'; this.on(CHANGE_SOURCE_EVENT, callback);},

    getVolume: function () { 'use strict'; return _player.volume;},
    getPlaybackRate: function () { 'use strict'; return _player.playback_rate;},
    getTime: function () { 'use strict'; return _player.time;},
    getSource: function () {
        'use strict';
        return {
            audio_src: _player.audio_src,
            podcast_name: _player.podcast_name,
            audio_title: _player.audio_title,
            audio_image: _player.audio_image
        };  
    }
});


PlayerStore.dispatchToken = AppDispatcher.register(function (action) {
    'use strict';

    switch (action.actionType) {
    case AppConstants.PLAYER_PLAY:
        PlayerStore.emitPlay();
        break;
    
    case AppConstants.PLAYER_PAUSE:
        PlayerStore.emitPause();
        break;
            
    case AppConstants.PLAYER_SET_TIME:
        _player.time = action.value;
        PlayerStore.emitSetTime();
        break;
     
    case AppConstants.PLAYER_SET_TIME_REPLAY:
        PlayerStore.emitSetTimeReplay();
        break;

    case AppConstants.PLAYER_SET_TIME_FORWARD:
        PlayerStore.emitSetTimeForward();
        break;
            
    case AppConstants.PLAYER_SET_VOLUME:
        _player.volume = action.value;
        PlayerStore.emitSetVolume();
        break;

    case AppConstants.PLAYER_SET_PLAYBACK_RATE:
        _player.playback_rate = action.value;
        PlayerStore.emitSetPlaybackRate();
        break;
            
    case AppConstants.PLAYER_TOOGLE_CAST:
        console.log('Store', 'toogle cast');
        PlayerStore.emitToogleCast();
        break;

    case AppConstants.PODCAST_SELECT_AUDIO:
        _player.audio_src = action.item.audio.enclosure.url;
        _player.podcast_name = action.item.podcast.name;
        _player.audio_title = action.item.audio.title;
        _player.audio_image = action.item.podcast.imageUrl;
        PlayerStore.emitChangeSource();
        break;

    default:
        // do nothing
    }

});

module.exports = PlayerStore;