import React, { Component } from 'react';
import connectionService from '../../Services/ConnectionService';
import ErrorMessage from '../../config/Message';
import Title from '../../config/titles';
import CarouselView from '../../components/layouts/CarouselView';
import Auth from '../../services/Auth';
import Loader from 'react-loader';

class NasInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            NassInfoData: [],
            isLoading: false
        };
        document.title = Title.NassInfo;
    }
    componentDidMount() {
        this.setState({ isLoading: true });
        fetch(connectionService.NasInfo, {
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
                    var NassInfoData = responseJson.NasInfo;
                    this.setState({ NassInfoData, isLoading: false });
                }
                else {
                    this.setState({ isLoading: false });
                    alert(ErrorMessage.ServerError);
                }
            })
            .catch((error) => {
                this.setState({ isLoading: false });
                alert(error);
            });
    }

    render() {
        var tabs = { MainHeaderColumn: "Name", tabItems: [{ Title: "Overview", DataField: "Overview" }, { Title: "Reference", DataField: "Reference" }] };
        return (
            <div>
                <Loader loaded={!this.state.isLoading}></Loader>
                <CarouselView data={this.state.NassInfoData} tabs={tabs} showNavBar={this.props.showNavBar} />
            </div>
        )
    }
}

export default NasInfo