var React = require('react');

var Progress = React.createClass({
	
	handleChange: function () {
	    this.props.onChange(this);
	}, 

    render: function () {

		return (
			<input type="range" ref="progressbar" onChange={this.handleChange} className="player-icon" min="0" max="100" />
		);
    }
});

module.exports = Progress;