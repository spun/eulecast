var React = require('react');
var PodcastAudiosListItem = require('../../components/podcast/PodcastAudiosListItem');
var PodcastStore = require('../../stores/PodcastStore');

function audiosItems() {
    return {
        data: PodcastStore.getPodcastInfo(),
        items: PodcastStore.getAudios()
    };
}

var PodcastAudiosList = React.createClass({
   getInitialState: function () {
        return {data: {}, items: []};
    },
        componentWillMount: function (){
        PodcastStore.addChangeListener(this._onChange);
    },

    _onChange: function () {
        this.setState(audiosItems());
    },  

    render: function () {
        var component = this;
        var items = this.state.items.map(function(item, id) {
            return <PodcastAudiosListItem podcastData={component.state.data} key={id} item = {item} />
        });

        return (
            <ul className="podcast-audios">
                {items}
            </ul>
        );
    }
});

module.exports = PodcastAudiosList;