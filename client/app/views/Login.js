import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import bootstrap from 'bootstrap';
import { Link, Location, browserHistory } from 'react-router';
import connectionService from '../Services/ConnectionService';
import Auth from '../services/Auth';
import Title from '../config/titles';
import SweetAlert from 'sweetalert-react';
import util from '../util';
import Loader from 'react-loader';

require('es6-promise').polyfill();
require('isomorphic-fetch');

class Login extends Component {
    constructor(props) {
        super(props);
        document.title = Title.Login;
        this.state = {
            show: false,
            sweetAlertTitle: "",
            isLoading: false,
            sweetAlertText: null
        }
    }
    navigate(e) {
        e.preventDefault();
        if (!this.state || !this.state.email || !this.state.password) {
            this.setState({ show: true, sweetAlertTitle: 'Error', sweetAlertText: 'Please Enter Username and password.' });
            return;
        } else {
            this.setState({ isLoading: true });
            var params = {};
            params.email = this.state.email;
            params.password = this.state.password;
            fetch(connectionService.Login, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params)
            }, this)
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.success) {
                        var moodleData = responseJson.config.filter(function (data) {
                            if (data.TypeId === 2) {
                                return data;
                            }
                        });
                        var baseURL = responseJson.config.find(x => x.TypeId === 1);
                        var moodleLoginUrl = moodleData.find(x => x.Name === 'login');

                        localStorage.setItem('moodleData', JSON.stringify(moodleData));
                        localStorage.setItem('baseURL', baseURL.Url);

                        util.loginMoodle(this.state.email, this.state.password, moodleLoginUrl.Url);

                        localStorage.setItem('menuData', JSON.stringify(responseJson.menu));
                        Auth.authenticateUser(responseJson.token);
                        Auth.setUser(responseJson.user);
                        this.setState({ isLoading: false });
                        this.context.router.replace('/main');
                    }
                    else {
                        console.log(responseJson);
                        this.setState({ isLoading: false, show: true, sweetAlertTitle: 'Error', sweetAlertText: 'Username or password incorrect.' });
                    }
                })
                .catch((error) => {
                    this.setState({ isLoading: false });
                    alert(error);
                });
        }
    }

    onChange(event) {
        if (event.target.type == 'email') {
            this.setState({ email: event.target.value });
        } else {
            this.setState({ password: event.target.value });
        }
    }

    onSuccessConfirm() {
        this.setState({ show: false });
    }
    render() {
        return (
            <div className="middle-box text-center loginscreen animated fadeInDown">
                <div>
                    <Loader loaded={!this.state.isLoading}></Loader>
                    <div>
                        <h1 className="logo-name">Demo</h1>
                    </div>
                    <form className="m-t" role="form" action="index.html">
                        <div className="form-group">
                            <input type="email" onChange={this.onChange.bind(this)} className="form-control" placeholder="Username" required="" />
                        </div>
                        <div className="form-group">
                            <input type="password" onChange={this.onChange.bind(this)} className="form-control" placeholder="Password" required="" />
                        </div>
                        <button onClick={this.navigate.bind(this)} type="submit" className="btn btn-primary block full-width m-b">Login</button>
                        <Link to="forgotPassword">
                            Forgot password?
                        </Link>
                    </form>
                </div>
                <SweetAlert show={this.state.show} title={this.state.sweetAlertTitle} text={this.state.sweetAlertText} onConfirm={this.onSuccessConfirm.bind(this)} />
            </div>
        )
    }
}
Login.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Login