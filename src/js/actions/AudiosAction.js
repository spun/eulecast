/*jslint node: true */

var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatchers/AppDispatcher');

var AudiosAction = {
    select: function (item) {
        'use strict';
        AppDispatcher.dispatch({
            actionType: AppConstants.SELECT_AUDIO,
            item: item
        });
    }
};

module.exports = AudiosAction;