import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { smoothlyMenu } from '../layouts/Helpers';
import connectionService from '../../Services/ConnectionService';
import { Link, Location, browserHistory } from 'react-router';

class TopHeader extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    toggleNavigation(e) {
        e.preventDefault();
        $("body").toggleClass("mini-navbar");
        if ($("body").hasClass("mini-navbar")) {
            $("body").removeClass('cust-fix-titlebar');
        }
        else {
            $("body").addClass('cust-fix-titlebar');
        }
        smoothlyMenu();
    }
    onMainIconClick() {
        this.context.router.push('/main');
    }

    render() {
        return (
            <div className="row border-bottom">
                <nav className="navbar navbar-fixed-top white-bg text-center" role="navigation" style={{ marginBottom: 0 }}>
                    <div className="navbar-header">
                        <a className="navbar-minimalize btn btn-primary" onClick={this.toggleNavigation} href="#"><i className="fa fa-bars"></i> </a>
                    </div>
                    {localStorage.HeaderTitle != "undefined" ? <div className="top-title">{localStorage.HeaderTitle}</div> : null}
                    <ul className="nav navbar-top-links navbar-right">
                        <li>
                            <span className="fa fa-home homeicon" onClick={this.onMainIconClick.bind(this)}></span>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}

TopHeader.defaultProps = {
    url: connectionService.Login
}
TopHeader.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default TopHeader