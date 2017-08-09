import React from 'react';
import Auth from './../../services/Auth';
import { browserHistory } from 'react-router';
import util from '../../util';

class EnsureLoggedInContainer extends React.Component {
    componentDidMount() {
        if (!this.isLoggedIn()) {
            util.logOutMoodle();
            Auth.deauthenticateUser();
            localStorage.clear();
            this.context.router.replace('/login');
            if (window.cordova && navigator && navigator.app) {
                navigator.app.exitApp();
            }
        }
    }

    isLoggedIn() {
        let toReturn = false;
        toReturn = Auth.isUserAuthenticated();
        return toReturn;
    }

    render() {
        if (this.isLoggedIn()) {
            return this.props.children
        } else {
            return null
        }
    }
}

EnsureLoggedInContainer.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default EnsureLoggedInContainer