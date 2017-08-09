import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import ErrorMessage from '../config/Message';
var Loader = require('react-loader');
import { Link, Location, browserHistory } from 'react-router';
import connectionService from '../Services/ConnectionService';
import SweetAlert from 'sweetalert-react';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onClickAlreadyToken = this.onClickAlreadyToken.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickBack = this.onClickBack.bind(this);
        this.state = {
            showAllField: false,
            isLoading: false,
            isError: false,
            errorMessage: '',
            showAlert: false
        }
    }

    onFormSubmit(e) {
        e.preventDefault();
        var formData = {};
        formData.email = this.refs.email.value ? this.refs.email.value : null;
        if (this.state.showAllField) {
            formData.token = this.refs.token.value ? this.refs.token.value : null;
            formData.password = this.refs.password.value ? this.refs.password.value : null;
        }

        this.setState({ isLoading: true, isError: false, errorMessage: '' });

        if (!this.state.showAllField) {
            if (!formData.email) {
                this.setState({ isLoading: false, isError: true, errorMessage: 'Please Enter Email address' });
                return;
            }
        } else {
            if (!formData.email) {
                this.setState({ isLoading: false, isError: true, errorMessage: 'Please Enter Email address' });
                return;
            } else if (!formData.token) {
                this.setState({ isLoading: false, isError: true, errorMessage: 'Please Enter Token' });
                return;
            } else if (!formData.password) {
                this.setState({ isLoading: false, isError: true, errorMessage: 'Please Enter Password' });
                return;
            } else if (!this.refs.confirm.value) {
                this.setState({ isLoading: false, isError: true, errorMessage: 'Password enter confirm password' });
                return;
            } else if (formData.password != this.refs.confirm.value) {
                this.setState({ isLoading: false, isError: true, errorMessage: 'Password does not match the confirm password' });
                return;
            }
        }

        //if showAllField is true then request for changes password otherwise send token
        fetch(connectionService.ForgotPassword, {
            method: 'POST',
            mode: 'CORS',
            body: JSON.stringify(formData),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success) {
                    if (responseJson.isTokenSent) {
                        this.setState({ isError: true, errorMessage: responseJson.message, showAllField: true, isLoading: false });
                    }
                    else {
                        this.setState({ showAlert: true, successText: responseJson.message, isLoading: false });
                    }
                }
                else {
                    this.setState({ isError: true, errorMessage: responseJson.message, isLoading: false });
                }
            })
            .catch((error) => {
                console.error(error);
                this.setState({ isLoading: false, isError: true, errorMessage: 'Something went wrong.' });
            });
    }

    onClickAlreadyToken(e) {
        e.preventDefault();
        this.setState({ showAllField: true });
    }

    onClickCancel(e) {
        e.preventDefault();
        this.context.router.replace('login');
    }
    onClickBack(e) {
        e.preventDefault();
        this.setState({ showAllField: false });
    }

    onClickAlert() {
        this.setState({ showAlert: false });
        this.context.router.replace('/login');
    }

    render() {
        return (
            <div className="middle-box text-center loginscreen animated fadeInDown">
                <div>
                    <Loader loaded={!this.state.isLoading}></Loader>
                    <div>
                        <h1 className="logo-name">TRAC-ON</h1>
                    </div>
                    <div>
                        <i className="fa fa-lock fa-4x"></i><h2>Forgot Password</h2>
                    </div>
                    <p>Enter a registered email address to generate a token.</p>
                    {this.state.isError ? <h4 style={{ color: 'rgb(160, 93, 93)', background: '#ffacac', padding: '0.5em' }}>{this.state.errorMessage}</h4> : null}
                    <form className="m-t" role="form" onSubmit={this.onFormSubmit} method="POST">
                        <div className="form-group">
                            <input type="email" className="form-control" ref="email" placeholder="Enter email" required="" />
                        </div>
                        {
                            this.state.showAllField ?
                                <div>
                                    <div className="form-group">
                                        <input type="test" className="form-control" ref="token" placeholder="Enter Token" required="" />
                                    </div>

                                    <div className="form-group">
                                        <input type="password" className="form-control" ref="password" placeholder="Enter New Password" required="" />
                                    </div>

                                    <div className="form-group">
                                        <input type="password" className="form-control" ref="confirm" placeholder="Enter Confirm Password" required="" />
                                    </div>
                                    <button className="btn btn-primary block full-width m-b">Change Password</button>
                                    <button className="btn btn-primary block full-width m-b" onClick={this.onClickBack}>Back</button>
                                </div> :
                                <div className="form-group">
                                    <button className="btn btn-primary block full-width m-b">Submit</button>
                                    <button className="btn btn-primary block full-width m-b" onClick={this.onClickAlreadyToken}>Already have Token</button>
                                    <button className="btn btn-primary block full-width m-b" onClick={this.onClickCancel}>Back To Login</button>
                                </div>
                        }

                    </form>
                    <SweetAlert show={this.state.showAlert} title="Success" text={this.state.successText} onConfirm={this.onClickAlert.bind(this)} />
                </div>
            </div >
        )
    }
}
ForgotPassword.contextTypes = {
    router: React.PropTypes.object.isRequired
};
export default ForgotPassword