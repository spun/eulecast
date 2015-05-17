var React = require('react');
var PlayerStore = require('../../stores/PlayerStore');
var ProgressBar = require('../../components/player/ProgressBar');
var TimeReplayButton = require('../../components/player/TimeReplayButton');
var PlayButton = require('../../components/player/PlayButton');
var TimeForwardButton = require('../../components/player/TimeForwardButton');
var VolumeBar = require('../../components/player/VolumeBar');
var CastButton = require('../../components/player/CastButton');
var PlaybackRateButton = require('../../components/player/PlaybackRateButton');

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

var Player = React.createClass({

	getInitialState: function () {
		return {
            audio_player: new Audio(),
            audio_playback_rate: 1.0,
            audio_time: 0,
            audio_duration: 0,
            audio_src: '',
			podcast_name: '',
			audio_title: '',
			audio_image: '',
			audio_isPlaying: ''
        };
    },

    componentDidMount: function () {
        this.state.audio_player.addEventListener('timeupdate', this.ontimeupdate); 
        this.state.audio_player.addEventListener('durationchange', this.ondurationchange);
    },

    componentWillMount: function () {
        PlayerStore.addPlayListener(this._onPlay);
        PlayerStore.addPauseListener(this._onPause);
        PlayerStore.addSetTimeListener(this._onSetTime);
        PlayerStore.addSetTimeReplayListener(this._onSetTimeReplay);
        PlayerStore.addSetTimeForwardListener(this._onSetTimeForward);
        PlayerStore.addSetVolumeListener(this._onSetVolume);
        PlayerStore.addSetPlaybackRateListener(this._onSetPlaybackRate);
        PlayerStore.addToogleCastListener(this._onToogleCast);
        PlayerStore.addChangeSourceListener(this._onChangeSource);
    },

    ontimeupdate: function() {
    	this.setState({
            audio_time: this.state.audio_player.currentTime,
        });
    },

    ondurationchange: function() {
    	this.setState({
            audio_duration: this.state.audio_player.duration,
        });
    },

    _onPlay: function() {
		this.state.audio_player.play();
		this.setState({ 
			audio_isPlaying: true
		});  
    },

    _onPause: function() {    	
		this.state.audio_player.pause();
		this.setState({ 
			audio_isPlaying: false
		}); 
    },

    _onSetTime: function() {
		this.state.audio_player.pause();
        var newProgressValue = PlayerStore.getTime();
        this.state.audio_player.currentTime = newProgressValue;
        this.state.audio_player.play();
    },

     _onSetTimeReplay: function() {
		this.state.audio_player.pause();
        this.state.audio_player.currentTime = this.state.audio_player.currentTime - 10;
        this.state.audio_player.play();   
    },

    _onSetTimeForward: function() {
		this.state.audio_player.pause();
        this.state.audio_player.currentTime = this.state.audio_player.currentTime + 30;
        this.state.audio_player.play();   
    },

    _onSetVolume: function() {
		var newVolumeValue = PlayerStore.getVolume() / 100;
		this.state.audio_player.volume = newVolumeValue;
    },

    _onSetPlaybackRate: function() {
		var newPlaybackRate = PlayerStore.getPlaybackRate();
		this.state.audio_player.playbackRate  = newPlaybackRate;
		this.setState({ 
			audio_playback_rate: newPlaybackRate
		}); 
    },

    _onToogleCast: function() {
		console.log('Component (reaction)', 'ToogleCast');
    },

    _onChangeSource: function() {
		var data = PlayerStore.getSource();

		this.state.audio_player.src = data.audio_src; 
		this.state.audio_player.playbackRate  = this.state.audio_playback_rate;       
        this.state.audio_player.play();

		this.setState({ 
			audio_src: data.audio_src,
			podcast_name: data.podcast_name,
			audio_title: data.audio_title,
			audio_image: data.audio_image,
			audio_isPlaying: true
		});        
    },

    render: function () {

    	var formatedTime = {
    		time: toHHMMSS(Math.round(this.state.audio_time)),
    		duration: toHHMMSS(Math.round(this.state.audio_duration))
    	};

		return (
			<div className="player">				
				<div className="player-top"> 
					<ProgressBar value={this.state.audio_time} max={this.state.audio_duration} />                   
                </div>
				<div className="player-left">
                    <img  className="now-playing-image" src={this.state.audio_image} />
                    <div className="now-playing-text">
                        <p className="podcast-name">{this.state.podcast_name}</p>
                        <p className="audio-title">{this.state.audio_title}</p>
                        <p className="audio-title">{formatedTime.time} / {formatedTime.duration}</p>
                    </div>
                </div>
				<div className="player-middle">
					<TimeReplayButton />
                	<PlayButton isPlaying={this.state.audio_isPlaying} />  
					<TimeForwardButton />
                </div>
				<div className="player-right"> 
					<PlaybackRateButton rate={this.state.audio_playback_rate} />  
                    <VolumeBar />
                    <CastButton /> 
                </div>
			</div>
		);
    }
});

module.exports = Player;