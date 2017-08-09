import React, { Component } from 'react';
import Title from '../../config/titles';
import MoodleView from './../../components/layouts/MoodleView';

class Profile extends Component {
    constructor(props) {
        super(props);
        document.title = Title.Profile;
    }
    render() {
        return (
            <MoodleView location={this.props.location} />
        )
    }
}

export default Profile