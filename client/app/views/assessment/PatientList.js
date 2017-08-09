import React, { Component } from 'react';
import List from '../../components/layouts/List';
import connectionService from '../../Services/ConnectionService';
import Auth from '../../services/Auth';

class PatientList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            forHistory: false,
            showIcon: true
        }
    }

    componentDidMount() {
        var me = this;
        this.getPatients('', function (items) {
            me.setState({ data: items })
        });
    }

    getPatients(patientName, cb) {
        var url = connectionService.PatientDetail;
        var params = [];
        if (this.state.forHistory) {
            params.push('forHistory=true');
        }
        if (patientName) {
            params.push('name=' + patientName);
        }
        if (params.length > 0) {
            url += '?' + params.join('&')
        }

        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + Auth.getToken()
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success) {
                    var patientData = responseJson.PatientData;
                    cb(patientData);
                }
                else {
                    alert(ErrorMessage.ServerError);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    onItemClick(item) {
        this.context.router.push('/assessment/perform-assessment/' + item.Id);
    }

    onPatientSearchClick(patientName) {
        var me = this;
        this.getPatients(patientName, function (items) {
            me.setState({ data: items })
        });
    }

    render() {
        return (
            <List data={this.state.data} onListItemClick={this.onItemClick.bind(this)} onPatientSearchClick={this.onPatientSearchClick.bind(this)} showIcon={this.state.showIcon} />
        )
    }
}

PatientList.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default PatientList