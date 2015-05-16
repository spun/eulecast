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

		var imgSrc = 'img/favicon.png';
		if(this.props.item.thumbnail) {
		imgSrc = this.props.item.thumbnail
		}


		return (
			<li onClick={this.handleClick}>
				{removeButton} 
				<img className="subscription-image" src={imgSrc} />
				<span className="subscription-name" >{this.props.item.name}</span>
			</li>
		);
	}
});

module.exports = SubscriptionsListItem;