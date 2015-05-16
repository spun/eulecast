var PodcastAction = require('../../actions/PodcastAction');
var React = require('react');

var PodcastAudiosListItem = React.createClass({

	handleClick: function () {
		var audioData = {
			podcast: this.props.podcastData,
			audio: this.props.item
		}
		PodcastAction.selectAudio(audioData);
	},

	render: function () {
		return <li onClick={this.handleClick}>{this.props.item.title}</li>
	}
});

module.exports = PodcastAudiosListItem;