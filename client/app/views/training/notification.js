import React, { Component } from 'react';
import Title from '../../config/titles';
import MoodleView from './../../components/layouts/MoodleView';

class Notification extends Component {
    constructor(props) {
        super(props);
        document.title = Title.Notification;
    }
    render() {
        return (
            <MoodleView location={this.props.location} />
        )
    }
}

export default Notification