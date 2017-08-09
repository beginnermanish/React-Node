import React, { Component } from 'react';
import connectionService from '../../Services/ConnectionService';
import ErrorMessage from '../../config/Message';
import Title from '../../config/titles';
import CarouselView from '../../components/layouts/CarouselView';
import Auth from '../../services/Auth';
import Loader from 'react-loader';

class Drugs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Drugs: { Opioids: [], Nonopioid: [] },
            isLoading: false
        };
        document.title = Title.Drugs;
    }
    componentDidMount() {
        this.setState({ isLoading: true });
        fetch(connectionService.Drugs, {
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
                    this.setState({ Drugs: responseJson.Drugs, isLoading: false });
                }
                else {
                    this.setState({ isLoading: false });
                    alert(ErrorMessage.ServerError);
                }
            })
            .catch((error) => {
                alert(error);
                this.setState({ isLoading: false });
            });
    }

    render() {
        var drugs = this.state.Drugs;
        var tabs = {
            MainHeaderColumn: "Generic_name",
            tabItems: [
                { Title: "Overview", DataField: "Overview" },
                { Title: "Side Effects", DataField: "Side_effects" },
                { Title: "On-Set", DataField: "On_set" },
                { Title: "Reference", DataField: "Reference" }]
        };

        const sections = [
            { title: "Opioids", items: drugs.Opioids, tabs: tabs },
            { title: "Other Drugs", items: drugs.Nonopioid, tabs: tabs }
        ]

        return (
            <div>
                <Loader loaded={!this.state.isLoading}></Loader>
                <CarouselView tabs={tabs} sections={sections} showNavBar={this.props.showNavBar} />
            </div>
        )
    }
}

export default Drugs