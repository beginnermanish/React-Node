import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, Location, browserHistory } from 'react-router';
import Auth from '../../services/Auth';
import { smoothlyMenu } from '../layouts/Helpers';
import util from '../../util';

var Navigation = React.createClass({
    getInitialState: function (props) {
        this.state = this.state ? this.state : {};
        this.state.menuItems = this.state.menuItems ? this.state.menuItems : [];
        return this.state;
    },
    componentWillMount() {
        if (localStorage.menuData) {
            var data = JSON.parse(localStorage.menuData);
            this.state.menuItems = data;
        }
    },
    componentDidMount() {
        const { menu } = this.refs;
        $(menu).metisMenu();
    },
    componentDidUpdate: function () {
        const { menu } = this.refs;
        $(menu).metisMenu();
    },

    activeRoute(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
    },

    secondLevelActive(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
    },

    onMenuItemClick(path, contaxt) {
        path = path.toLowerCase();
        this.context.router.push('/' + path);
    },

    onMainIconClick() {
        this.context.router.push('/main');
    },

    onLogOut() {
        util.logOutMoodle();
        Auth.deauthenticateUser();
        browserHistory.push('#/login');
        localStorage.clear();

        if (window.cordova && navigator && navigator.app) {
            navigator.app.exitApp();
        }
    },
    toggleNavigation(e) {
        if (jQuery(window).width() <= 768) {
            $("body").toggleClass("mini-navbar");
            if ($("body").hasClass("mini-navbar")) {
                $("body").removeClass('cust-fix-titlebar');
            }
            else {
                $("body").addClass('cust-fix-titlebar');
            }
            smoothlyMenu();
        }
    },

    render() {
        var menus = this.state.menuItems;
        var me = this;
        return (
            <nav className="navbar-default navbar-static-side" role="navigation" >
                <div className="sidebar-collapse">
                    <img src={util.getImageSrc("img/logo.png")} className="header-logo" onClick={this.onMainIconClick} />
                    <ul className="nav metismenu" id="side-menu" ref="menu">
                        <li className="nav-header text-center">
                            <div className="dropdown profile-element">
                                <a className="dropdown-toggle">
                                    <span className="clear">
                                        <span className="block m-t-xs"> <strong className="font-bold">TRAC-ON</strong></span>
                                    </span>
                                </a>
                            </div>
                            <div className="logo-element">
                                Trac On
                            </div>
                        </li>
                        {

                            menus.length > 0 ? menus.map(function (menuItem, index) {
                                var isChild = false;
                                var subMenuItems = menuItem.items;
                                if (subMenuItems != null && subMenuItems.length > 0) {
                                    isChild = true;
                                }

                                if (!isChild) {

                                    return (<li key={index} className={this.activeRoute("/" + menuItem.label)}>
                                        <Link to={"/"}>
                                            <i>
                                                <img src={util.getImageSrc('img/menu-icons/' + menuItem.item.Icon_file + "_16.png")} />
                                            </i>
                                            <span className="nav-label">{menuItem.Caption}</span>
                                        </Link>
                                    </li>)
                                }
                                else {
                                    return (<li key={index} className={this.activeRoute("/" + menuItem.label)}>
                                        <Link to={"/"} onClick={this.onMenuItemClick.bind(this, menuItem.label)}>
                                            <i>
                                                <img src={util.getImageSrc('img/menu-icons/' + menuItem.item.Icon_file + "_28.png")} />
                                            </i>
                                            <span className="nav-label">{menuItem.Caption}</span> <span className="fa arrow"></span>
                                        </Link>
                                        <ul className={this.secondLevelActive("/" + menuItem.label)} >
                                            {subMenuItems.map(function (submenuItem, index1) {
                                                if (submenuItem.item.Name) {
                                                    return (
                                                        <li key={index1} className={this.activeRoute("/" + submenuItem.item.Name.toLowerCase())}>
                                                            <Link onClick={this.toggleNavigation} to={"/" + submenuItem.item.Menu_name.toLowerCase() + "/" + submenuItem.item.Name.toLowerCase().replace(" ", "-")}>
                                                                <i>
                                                                    <img src={util.getImageSrc('img/menu-icons/' + submenuItem.item.Icon_file + "_16.png")} />
                                                                </i>
                                                                <span className="nav-label">{submenuItem.item.Caption}</span>
                                                            </Link>
                                                        </li>
                                                    );
                                                }
                                            }, this)
                                            }
                                        </ul>
                                    </li>)
                                }
                            }, this) : null
                        }

                        <li className={this.activeRoute("/logout")}>
                            <Link to={"/"} onClick={this.onLogOut}>
                                <i className="fa fa-sign-out signout"></i>
                                <span className="nav-label signout-label">Logout</span>
                            </Link>
                        </li>)
                    </ul>
                </div>
            </nav >
        )
    }
});

Navigation.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Navigation;