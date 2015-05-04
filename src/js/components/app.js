/** @jsx React.DOM */

var React = require('react');
var Subscriptions = require('../components/subscriptions/Subscriptions');
var PlayList = require('../components/playlist');
var AudiosList = require('../components/AudiosList');
var Player = require('../components/player/Player');

var APP = React.createClass({
    render: function () {
        return (
            <div className = "container">
                <Subscriptions />
                <AudiosList />  
                <Player/>                  
            </div>                    
        )
    }
});

module.exports = APP;