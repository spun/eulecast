var React = require('react');
var PodcastStore = require('../../stores/PodcastStore');

function podcastInfo() {
    return {item: PodcastStore.getPodcastInfo()};
}

var PodcastInfo = React.createClass({
   	getInitialState: function () {
        return {item: {}};
    },

    componentWillMount: function () {
        PodcastStore.addChangeListener(this._onChange);
    },

    _onChange: function () {
        this.setState(podcastInfo());
    },  

    render: function () {

        return (
            <div className="podcast-info">

                <img className="podcast-image" src={this.state.item.imageUrl} />
                <div className="podcast-info-text">
                    <h2 className="name">{this.state.item.name}</h2>
                    <h3 className="author">{this.state.item.author}</h3>
                </div>
            </div>
        );
    }
});

module.exports = PodcastInfo;