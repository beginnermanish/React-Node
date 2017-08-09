import React, { Component } from 'react';
import connectionService from '../../Services/ConnectionService';
import ErrorMessage from '../../config/Message';
import CarouselView from '../../components/layouts/CarouselView';
import Title from '../../config/titles';
import Auth from '../../services/Auth';
import Loader from 'react-loader';

class Signs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Signs: [],
            isLoading: false
        };
        document.title = Title.Signs;
    }
    componentDidMount() {
        this.setState({ isLoading: true });
        fetch(connectionService.Signs, {
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
                    var Signs = responseJson.Signs;
                    Signs.map((group, groupIndex) => {
                        group.expanded = false;
                    });
                    this.setState({ Signs, isLoading: false });
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
                { Title: "Overview", DataField: "Method" },
                { Title: "How-To", DataField: "Score_desc" },
                { Title: "Reference", DataField: "Reference" },
                { Title: "Image", DataField: "Images", HideIfNull: true },
                { Title: "Video", DataField: "Video", HideIfNull: true }
            ]
        };
        return (<div>
            <Loader loaded={!this.state.isLoading}></Loader>
            <CarouselView data={this.state.Signs} tabs={tabs} showNavBar={this.props.showNavBar} />
        </div>
        )
    }
}

export default Signs