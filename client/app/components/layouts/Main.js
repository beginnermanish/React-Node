import React from 'react';
import Progress from '../common/Progress';
import Navigation from '../common/Navigation';
import Footer from '../common/Footer';
import TopHeader from '../common/TopHeader';
import { correctHeight, detectBody } from './Helpers';
import ReactIdleTimer from 'react-idle-timer';
import { Link, Location, browserHistory } from 'react-router';
import CustomNavBar from './../common/CustomNavBar';
import Auth from './../../services/Auth';
import util from '../../util';

require("babel-polyfill");

class Main extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            timeout: 300000,//5 mins
            showNavBar: true
        }
    }
    _onActive() {
        console.log('User active');
    }

    _onIdle() {
        if (location.hash.indexOf("training") > -1) {
            this.resetTimer();
            return;
        }
        util.logOutMoodle();
        Auth.deauthenticateUser();
        localStorage.clear();
        this.context.router.replace('/login');
        if (window.cordova && navigator && navigator.app) {
            navigator.app.exitApp();
        }
    }
    showNavBar(showNavBar) {
        this.setState({ showNavBar: showNavBar });
    }
    render() {
        let wrapperClass = "gray-bg " + this.props.location.pathname;
        let me = this;
        var children = React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                showNavBar: me.showNavBar.bind(me)
            })
        });

        return (
            <ReactIdleTimer
                ref="idleTimer"
                activeAction={this._onActive.bind(this)}
                idleAction={this._onIdle.bind(this)}
                timeout={this.state.timeout}
                startOnLoad={true}
                format="MM-DD-YYYY HH:MM:ss.SSS">
                <div id="wrapper">
                    <Progress />
                    <Navigation location={this.props.location} />
                    <div id="page-wrapper" className={wrapperClass}>
                        <TopHeader />
                        {this.state.showNavBar ? <CustomNavBar /> : null}
                        {children}
                        <Footer />
                    </div>
                </div>
            </ReactIdleTimer>
        )
    }
    resetTimer() {
        console.log('reset timer');
        this.refs.idleTimer.reset();
    }
    componentDidMount() {
        detectBody();
        correctHeight();
        // Run correctHeight function on load and resize window event
        $(window).bind("load resize", function () {
            correctHeight();
            detectBody();
        });

        // Correct height of wrapper after metisMenu animation.
        $('.metismenu a').click(() => {
            setTimeout(() => {
                correctHeight();
            }, 300)
        });
    }
    componentWillUpdate(nextProps) {
        if (this.state.showNavBar == false) {
            this.showNavBar(true);
        }
    }
}

Main.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Main