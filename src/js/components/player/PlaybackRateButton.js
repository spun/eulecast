var React = require('react');
var PlayerAction = require('../../actions/PlayerAction');

var PlaybackRateButton = React.createClass({

	handleClick: function () {
		switch(this.props.rate) {
		case 0.5:
	        PlayerAction.setPlaybackRate(1.0);
	        break;
	    case 1:
	        PlayerAction.setPlaybackRate(1.5);
	        break;	    
	    case 1.5:
	        PlayerAction.setPlaybackRate(2);
	        break;	   
	    case 2:
	        PlayerAction.setPlaybackRate(0.5);
	        break;
	    default:	        
	        PlayerAction.setPlaybackRate(1.0);
		}
	}, 

    render: function () {

		return (
			<p onClick={this.handleClick} className="player-icon">x {this.props.rate}</p>
		);
    }
});

module.exports = PlaybackRateButton;