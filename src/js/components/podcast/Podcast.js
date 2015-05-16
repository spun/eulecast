var React = require('react');
var AudiosStore = require('../../stores/PodcastStore');
var PodcastInfo = require('../../components/podcast/PodcastInfo');
var PodcastAudiosList = require('../../components/podcast/PodcastAudiosList');

var Podcast = React.createClass({

    render: function () {

        return (
            <div className="podcast-wrapper">
                <div className="podcast">
                    <PodcastInfo />
                    <PodcastAudiosList />
                </div>
            </div>
        );
    }
});

module.exports = Podcast;