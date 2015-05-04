var React = require('react');

var PlayButton = React.createClass({

	handleClick: function () {
	    this.props.onClick(this);
	}, 

    render: function () {
    	var textButton = this.props.isPlaying ? 'Pause' : 'Play';

		return (
			<button onClick={this.handleClick}>{textButton}</button>
		);
    }
});

module.exports = PlayButton;