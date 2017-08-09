import React, { Component } from 'react';
import connectionService from '../../Services/ConnectionService';
import ErrorMessage from '../../config/Message';
import CarouselView from '../../components/layouts/CarouselView';
import Title from '../../config/titles';
import Auth from '../../services/Auth';
import Loader from 'react-loader';

class PharmacoLogical extends Component {
    constructor(props) {
        super(props);

        this.state = {
            PharmacoLogical: [],
            isLoading: false
        };
        document.title = Title.Pharmacological;
    }
    componentDidMount() {
        this.setState({ isLoading: true });
        fetch(connectionService.PharmacoLogical, {
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
                    this.setState({ PharmacoLogical: responseJson.PharmacoLogical, isLoading: false });
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
            MainHeaderColumn: "Name",
            tabItems: [
                { Title: "Overview", DataField: "Overview" },
                { Title: "Reference", DataField: "Reference" }
            ]
        };
        return (
            <div>
                <Loader loaded={!this.state.isLoading}></Loader>
                <CarouselView data={this.state.PharmacoLogical} tabs={tabs} showNavBar={this.props.showNavBar} />
            </div>
        )
    }
}

export default PharmacoLogical