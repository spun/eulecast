/** @jsx React.DOM */

var React = require('react');
var Subscriptions = require('../components/subscriptions/Subscriptions');
var PlayList = require('../components/playlist');
var Podcast = require('../components/Podcast/Podcast');
var Player = require('../components/player/Player');

var APP = React.createClass({
    render: function () {
        return (
            <div className = "container">
                <Subscriptions />
                <Podcast />  
                <Player/>                  
            </div>                    
        )
    }
});

module.exports = APP;