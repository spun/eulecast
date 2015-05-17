var React = require('react');
var PlayerAction = require('../../actions/PlayerAction');

var ProgressBar = React.createClass({
	
	handleChange: function () {
	    var progressValue = this.refs.progressbar.getDOMNode().value;
		PlayerAction.setTime(progressValue);
	}, 

    render: function () {

		return (
			<input type="range" ref="progressbar" onChange={this.handleChange} className="player-icon" min="0" max={this.props.max} value={this.props.value} />
		);
    }
});

module.exports = ProgressBar;