var React = require('react');
var SubscriptionsList = require('../../components/subscriptions/SubscriptionsList');

var Subscriptions = React.createClass({

	getInitialState: function () {
        return {
            editMode: false
        };
    },

	editModeToggle: function () {
		this.setState({
            editMode: !this.state.editMode
        });
	},

    render: function () {
        return (
        	<div className="sidebar">
				<input type="checkbox" name="vehicle" value="Bike" onChange={this.editModeToggle} />Edit
	        	<SubscriptionsList editMode={this.state.editMode} />
        	</div>
        );
    }
});

module.exports = Subscriptions;