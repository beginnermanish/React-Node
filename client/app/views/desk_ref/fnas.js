import React, { Component } from 'react';
import connectionService from '../../Services/ConnectionService';
import ErrorMessage from '../../config/Message';
import Title from '../../config/titles';
import Auth from '../../services/Auth';

class Fnas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Fnas: []
        };
        document.title = Title.Fnas;
    }
    componentDidMount() {
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
                    var Fnas = responseJson.Fnas;
                    this.setState({ Fnas });
                }
                else {
                    alert(ErrorMessage.ServerError);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        var fnas = this.state.Fnas;
        return (
            <div className="wrapper wrapper-content">
                <div className="row">
                    <div className="ibox-title">
                        <h1>FNAS</h1>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/*{nasInfo.map(function (field, index) {
                                    return (<tr key={index}>
                                        <td>{field.Name}</td>
                                    </tr>
                                    )
                                })}*/}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        )
    }
}

export default Fnas