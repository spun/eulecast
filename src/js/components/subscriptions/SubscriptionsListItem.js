var SubscriptionsAction = require('../../actions/SubscriptionsAction');
var React = require('react');

var SubscriptionsListItem = React.createClass({

	handleClick: function () {
		SubscriptionsAction.select(this.props.item);
	},

	handleRemove: function () {
		SubscriptionsAction.remove(this.props.item);
	},

	render: function () {
		var removeButton;
		if (this.props.editMode) {
		    removeButton = <button onClick={this.handleRemove}>X</button>;
		}

		return (
			<li>{removeButton} <span onClick={this.handleClick}>{this.props.item.name}</span></li>
		);
	}
});

module.exports = SubscriptionsListItem;