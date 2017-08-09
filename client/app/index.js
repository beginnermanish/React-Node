import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory } from 'react-router';
import routes from './config/routes';
import jquery from 'jquery';
import metismenu from 'metismenu';
import util from './util';
import moment from 'moment';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './../../node_modules/font-awesome/css/font-awesome.css'
import './../../node_modules/animate.css/animate.min.css'
import './../public/styles/style.css'


window.addEventListener('error', function (e) {
    if (window.location.href.indexOf('localhost') > -1) {
        return;
    }
    var user = '';
    if (localStorage.user) {
        var currentUser = JSON.parse(localStorage.user);
        if (currentUser) {
            user = currentUser.Email;
        }
    }
    var metaData = {
        rawurl: window.location.href,
        exception: [
            '<b>AppVersion:</b> ' + window.localStorage.getItem('currentBuildVersion'),
            '<b>Message:</b> ' + e.message,
            '<b>StackTrace:</b> ' + e.error.stack,
        ].join('\r\n'),
        UserAgent: navigator.userAgent,
        User: user,
        Browser: navigator.appVersion,
        VirtualPath: 'TracOn',
        SystemPath: 'TracOn',
        Location: 'TracOn'
    }

    util.postError(metaData)
    console.error('caught the error: ' + e.message);
});

var textToSpeechProcessing = function () {
    const REFRESH_ACTION = "refresh";
    const SPEAK_ACTION = "speak";
    const CANCEL_ACTION = "cancel";

    window.addEventListener('message', function (event) {
        console.log("Message recieved on MAIN (CORDOVA) page");
        console.log(event.data);
        recieveActionRequestFromChild(event.data);
    });

    var synthesis = window.speechSynthesis;
    console.log(synthesis);

    function recieveActionRequestFromChild(actionRequest) {
        var type = actionRequest.type;
        if (type == REFRESH_ACTION) {
            synthesis.pause();
            synthesis.resume();
        } else if (type == SPEAK_ACTION) {
            var utterance = new SpeechSynthesisUtterance();
            utterance.text = actionRequest.data;
            synthesis.speak(utterance);
            console.log(utterance);
        } else if (type == CANCEL_ACTION) {
            synthesis.cancel();
        }
    }
}

window.onload = function () {
    document.addEventListener("deviceready", textToSpeechProcessing, false);
}

injectTapEventPlugin({
    shouldRejectClick: function (lastTouchEventTimestamp, clickEventTimestamp) {
        return true;
    }
});

ReactDOM.render(
    <Router history={hashHistory}>{routes}</Router>,
    document.getElementById('root')
);