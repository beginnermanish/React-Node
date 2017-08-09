import React, { Component } from 'react';
import IFrame from './../common/IFrame';

class MoodleView extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { location } = this.props;
        return (
            <IFrame location={location} />
        )
    }
}

export default MoodleView