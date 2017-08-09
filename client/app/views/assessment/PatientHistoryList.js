import React, { Component } from 'react';
import PatientList from './PatientList';

class PatientHistoryList extends PatientList {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            forHistory: true,
            showIcon: false
        }
    }

    componentWillMount() {
        this.setState({
            showIcon: false
        });
    }

    onItemClick(item) {
        this.context.router.push('/assessment/history/' + item.Id);
    }
}

PatientHistoryList.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default PatientHistoryList