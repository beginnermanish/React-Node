import React, { Component } from 'react';
import Title from '../../config/titles';
import MoodleView from './../../components/layouts/MoodleView';

class Course extends Component {
    constructor(props) {
        super(props);
        document.title = Title.Course;
    }
    render() {
        return (
            <MoodleView location={this.props.location} />
        )
    }
}

export default Course