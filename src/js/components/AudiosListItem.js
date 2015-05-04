var AudiosAction = require('../actions/AudiosAction');
var React = require('react');

var AudiosListItem = React.createClass({

	handleClick: function () {
		AudiosAction.select(this.props.item);
	},

	render: function () {
		return <li onClick={this.handleClick}>{this.props.item.title}</li>
	}
});

module.exports = AudiosListItem;