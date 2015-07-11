var React = require('react');
var SubscriptionsStore = require('../../stores/SubscriptionsStore');
var SubscriptionsAction = require('../../actions/SubscriptionsAction');
var SubscriptionsListItem = require('../../components/subscriptions/SubscriptionsListItem');

function subscriptionsItems() {
  return {items: SubscriptionsStore.getSubscriptions()};
}

var SubscriptionsList = React.createClass({

	getInitialState: function () {
		return {items: []}
	},

	componentDidMount: function () {
		SubscriptionsAction.reload();

		/*setTimeout(function () {
			SubscriptionsAction.refresh();
			setInterval(SubscriptionsAction.refresh, 900000);
		}, 10000);*/
		

	},

	componentWillMount: function () {
    	SubscriptionsStore.addChangeListener(this._onChange)
    },

    _onChange: function () {
    	this.setState(subscriptionsItems())
    },

	handleADD: function () {

		var podcastUrl = prompt("Podcast url", "");
		if (podcastUrl != null) {
			SubscriptionsAction.add({'url': podcastUrl});
		}
    	
    },

	render: function () {
		var props = this.props;
		var items = this.state.items.map(function (item, id) {
			return <SubscriptionsListItem key={id} item={item} editMode={props.editMode} />
		});

		var addButton;
		if (this.props.editMode) {
		    addButton = <button onClick={this.handleADD}>ADD</button>;
		}

		return (
			<div>
				{addButton}
				<ul onClick={this.handleClick} >
					{items}
				</ul>
			</div>
		);
	}
});

module.exports = SubscriptionsList;