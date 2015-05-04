var React = require('react');
var AudiosStore = require('../stores/AudiosStore');
var AudiosListItem = require('../components/AudiosListItem');

function audiosItems() {
    return {items: AudiosStore.getAudios()};
}

var AudiosList = React.createClass({
    getInitialState: function () {
        return {items: []};
    },

    componentWillMount: function (){
        AudiosStore.addChangeListener(this._onChange);
    },

    _onChange: function () {
        this.setState(audiosItems());
    },

	handleClick:function () {

    },
    render: function () {
        var items = this.state.items.map(function(item, id) {
            return <AudiosListItem key={id} item = {item} />
        });
        return (
            <div className="audios">
                <ul>
                    {items}
                </ul>
            </div>
        );
    }
});

module.exports = AudiosList;