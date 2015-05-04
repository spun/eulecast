/*jslint node: true */

var AppDispatcher = require('../dispatchers/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = "change";

var _playerAudio;


var PlayerStore = assign({}, EventEmitter.prototype, {

    emitChange: function () {
        'use strict';
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        'use strict';
        this.on(CHANGE_EVENT, callback);
    },

    getAudio: function () {
        'use strict';
        return _playerAudio;  
    }
});


PlayerStore.dispatchToken = AppDispatcher.register(function (action) {
    'use strict';

    switch (action.actionType) {
    case AppConstants.SELECT_AUDIO:
        _playerAudio = action.item.enclosure.url;
        PlayerStore.emitChange();

        break;

    default:
        // do nothing
    }

});

module.exports = PlayerStore;