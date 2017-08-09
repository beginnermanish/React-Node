import React, { Component } from 'react';
import connectionService from '../../Services/ConnectionService';
import ErrorMessage from '../../config/Message';
import Title from '../../config/titles';
import CarouselView from '../../components/layouts/CarouselView';
import Auth from '../../services/Auth';
import Loader from 'react-loader';

class Screening extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ScreeningData: [],
            isLoading: false
        };
        document.title = Title.Screening;
    }
    componentDidMount() {
        this.setState({ isLoading: true });
        fetch(connectionService.Screening, {
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
                    this.setState({ ScreeningData: responseJson.ScreeningData, isLoading: false });
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
        var tabs = {
            MainHeaderColumn: "Name", tabItems: [
                { Title: "Information", DataField: "Collect_procedure" },
                { Title: "Reference", DataField: "Reference" },
                { Title: "Image", DataField: "Image", HideIfNull: true },
                { Title: "Video", DataField: "Video", HideIfNull: true }
            ]
        };
        return (<div>
            <Loader loaded={!this.state.isLoading}></Loader>
            <CarouselView data={this.state.ScreeningData} tabs={tabs} showNavBar={this.props.showNavBar} />
        </div>
        )
    }
}

export default Screening