var React = require('react');
var PlayerAction = require('../../actions/PlayerAction');

var Volume = React.createClass({

	handleChange: function () {
        var volumeValue = this.refs.volumebar.getDOMNode().value;
		PlayerAction.setVolume(volumeValue);
	}, 

    render: function () {

		return (
			<div className="volume-control">
				<svg className="player-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
				    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
				    <path d="M0 0h24v24H0z" fill="none"/>
				</svg>
				<input type="range" ref="volumebar" onChange={this.handleChange} className="player-icon volume-range" min="0" max="100" />
			</div>
		);
    }
});

module.exports = Volume;