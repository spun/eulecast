var React = require('react');
var PlayerStore = require('../../stores/PlayerStore');
var PlayButton = require('../../components/player/PlayButton');
var VolumeBar = require('../../components/player/VolumeBar');
var ProgressBar = require('../../components/player/ProgressBar');
var CastButton = require('../../components/player/CastButton');


function playerAudio() {
    return PlayerStore.getAudio();
}

function toHHMMSS(time) {
    var sec_num = parseInt(time, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}


var player = React.createClass({

    getInitialState: function () {
		return {
            castStatus: "iddle",
            isPlaying: false,
            audio_player: new Audio(),            
            audio_title: "-",
            audio_podcast: "-",
            audio_image: "",
            audio_time: toHHMMSS(0),
            audio_duration: toHHMMSS(0),
            audio_volume: 100
        };
    },

    componentDidMount: function () {
        var component = this;
        document.body.addEventListener('keydown', function(e) {
            if(e.keyCode == 32) {
                component.handlePlayPause();
                e.preventDefault();
                e.stopPropagation();
            } else if(e.keyCode == 37) {
                component.flashback();
                e.preventDefault();
                e.stopPropagation();
            } else if(e.keyCode == 39) { 
                component.flashforward();
                e.preventDefault();
                e.stopPropagation();
            } else if(e.keyCode == 38) {                
                console.log('Up');
            } else if(e.keyCode == 40) {                
                console.log('Down');
            }
        });
        this.state.audio_player.addEventListener('timeupdate', this.ontimeupdate); 
        this.state.audio_player.addEventListener('durationchange', function() {
            var audioPlayer = component.state.audio_player;
            component.setState({
                audio_duration: toHHMMSS(Math.round(audioPlayer.duration))
            });
        }); 
    },

    ontimeupdate: function () {

    },

    componentWillMount: function () {
        PlayerStore.addChangeListener(this._onChange)
    },

    _onChange: function () {

        var audioData = playerAudio();
        var audioPlayer = this.state.audio_player;

        this.state.audio_player.src = audioData.audio.enclosure.url;

        this.setState({ 
            isPlaying: true,                       
            audio_title: audioData.audio.title,
            audio_podcast: audioData.podcast.name,
            audio_image: audioData.podcast.imageUrl,         
        });

        this.state.audio_player.play();
    },

    ontimeupdate: function() {
        var audioPlayer = this.state.audio_player;
        var number = audioPlayer.currentTime * 100 / audioPlayer.duration;

        this.updateProgressBar(number);
        this.updateTimer(number);

        if (number === 100) {
            return this.setState({
                isPlaying: false
            });
        }
    },

    updateProgressBar: function (progress) {
        var percent = Math.min(progress, 100);
        var bar = this.refs.progressbar.getDOMNode();
        bar.value = percent;
    },

    updateTimer: function (progress) {

        var audioPlayer = this.state.audio_player;
        this.setState({
            audio_time: toHHMMSS(Math.round(audioPlayer.currentTime)),
        });
    },

    handleProgressChange: function() {
        this.state.audio_player.pause();
        var newRangeValue = this.refs.progressbar.getDOMNode().value;
        this.state.audio_player.currentTime = newRangeValue * this.state.audio_player.duration / 100;
        this.state.audio_player.play();
    },

    handleVolumeChange: function(event) {        
        var newVolumeValue = event.refs.volumebar.getDOMNode().value;
        this.state.audio_player.volume = newVolumeValue / 100;;
    },

    handlePlayPause: function () {
        var state = this.state.audio_player;
        var isPlaying = this.state.isPlaying;

        this.setState({
            isPlaying: !isPlaying
        });

        if (isPlaying) {
            return state.pause();
        }
        return state.play();
    },

    flashback: function() {
        this.state.audio_player.pause();
        this.state.audio_player.currentTime = this.state.audio_player.currentTime - 30;
        this.state.audio_player.play();        
    },

    flashforward: function() {
        this.state.audio_player.pause();
        this.state.audio_player.currentTime = this.state.audio_player.currentTime +30;
        this.state.audio_player.play();        
    },

    render: function () {
    	return (
			<div className="player">  
                <div className="player-top">                    
                    <input type="range" ref="progressbar" onChange={this.handleProgressChange} className="player-icon" min="0" max="100" />
                </div>
                <div className="player-left">
                    <img  className="now-playing-image" src={this.state.audio_image} />
                    <div className="now-playing-text">
                        <p className="podcast-name">{this.state.audio_podcast}</p>
                        <p className="audio-title">{this.state.audio_title}</p>
                        <p className="audio-title">{this.state.audio_time} / {this.state.audio_duration}</p>
                    </div>
                </div>
                <div className="player-middle">
                    <svg onClick={this.flashback} title="-30" className="player-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
                    </svg>                 
                    <PlayButton onClick={this.handlePlayPause} isPlaying={this.state.isPlaying} />                
                    <svg onClick={this.flashforward} title="+30" className="player-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/>
                    </svg>
                </div> 
                <div className="player-right">   
                    <VolumeBar onChange={this.handleVolumeChange} />
                    <CastButton />              
                </div>
			</div>
	    )
    }
});

module.exports = player;