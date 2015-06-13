/*jslint node: true */

var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatchers/AppDispatcher');

var SubscripctionsAction = {

    select: function (item) {
        'use strict';
        AppDispatcher.dispatch({
            actionType: AppConstants.SELECT_SUBSCRIPTION,
            item: item
        });
    },

    reload: function () {
        'use strict';
        AppDispatcher.dispatch({
            actionType: AppConstants.RELOAD_SUBSCRIPTIONS
        });
    },    

    refresh: function () {
        'use strict';
        AppDispatcher.dispatch({
            actionType: AppConstants.REFRESH_SUBSCRIPTIONS
        });
    },

    add: function (item) {
        'use strict';
        AppDispatcher.dispatch({
            actionType: AppConstants.ADD_SUBSCRIPTION,
            item: item
        });
    },

    remove: function (item) {
        'use strict';
        AppDispatcher.dispatch({
            actionType: AppConstants.REMOVE_SUBSCRIPTION,
            item: item
        });
    },

    updateInfo: function (item) {
        'use strict';
        AppDispatcher.dispatch({
            actionType: AppConstants.UPDATE_SUBSCRIPTION_INFO,
            item: item
        });
    }
};

module.exports = SubscripctionsAction;