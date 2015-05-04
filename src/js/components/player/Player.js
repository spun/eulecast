var React = require('react');
var PlayerStore = require('../../stores/PlayerStore');
var PlayButton = require('../../components/player/PlayButton');



function playerAudio() {
    return PlayerStore.getAudio();
}

var player = React.createClass({

    getInitialState: function () {
		return {
            castStatus: "iddle",
            audio: new Audio(),
            isPlaying: false
        };
    },

    componentDidMount: function () {
    	
    },

    ontimeupdate: function () {

    },

    componentWillMount: function () {
        PlayerStore.addChangeListener(this._onChange)
    },

    _onChange: function () {
        this.setState({
            isPlaying: true
        });

        this.state.audio.src = playerAudio();
        this.state.audio.play();
    },

    update: function (progress) {

    },


    playPause: function () {
        var state = this.state.audio;
        var isPlaying = this.state.isPlaying;

        this.setState({
            isPlaying: !isPlaying
        });

        if (isPlaying) {
            return state.pause();
        }
        return state.play();
    },

    render: function () {
    	return (
			<div className="player">      
			    <button disabled>-30</button>
			    <PlayButton onClick={this.playPause} isPlaying={this.state.isPlaying} />                
                <button disabled>+30</button>
			</div>
	    )
    }
});

module.exports = player;