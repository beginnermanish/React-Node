import React, { Component } from 'react';
import connectionService from '../../Services/ConnectionService';
import ErrorMessage from '../../config/Message';
import CarouselView from '../../components/layouts/CarouselView';
import Title from '../../config/titles';
import Auth from '../../services/Auth';
import Loader from 'react-loader';

class GuideLine extends Component {
    constructor(props) {
        super(props);

        this.state = {
            GuideLineData: [],
            isLoading: false
        };
        document.title = Title.Guideline;
    }
    componentDidMount() {
        this.setState({ isLoading: true });
        fetch(connectionService.GuideLine, {
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
                    this.setState({ GuideLineData: responseJson.GuideLineData, isLoading: false });
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
            MainHeaderColumn: "Organization",
            tabItems: [
                { Title: "Overview", DataField: "Plan" },
                { Title: "Weaning", DataField: "Weaning_plan" },
                { Title: "Reference", DataField: "Reference" },
                { Title: "Image", DataField: "Image", HideIfNull: true },
                { Title: "Video", DataField: "Video", HideIfNull: true }
            ]
        };

        return (
            <div>
                <Loader loaded={!this.state.isLoading}></Loader>
                <CarouselView data={this.state.GuideLineData} tabs={tabs} showNavBar={this.props.showNavBar} />
            </div>
        )
    }
}

export default GuideLine