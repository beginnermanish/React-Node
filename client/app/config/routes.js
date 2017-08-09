import React from 'react';
import Main from '../components/layouts/Main';
import Blank from '../components/layouts/Blank';
import EnsureLoggedInContainer from '../components/common/EnsureLoggedInContainer';

import MainView from '../views/Main';
import LoginView from '../views/Login';
import ForgotPasswordView from '../views/ForgotPassword';
import PerformAssessment from '../views/assessment/PerformAssessment';
import Chart from '../views/assessment/Chart';
import History from '../views/assessment/History';

import NasInfo from '../views/desk_ref/NasInfo';
import Drugs from '../views/desk_ref/Drugs';
import Screening from '../views/desk_ref/Screening';
import GuideLine from '../views/desk_ref/GuideLine';
import Signs from '../views/desk_ref/Signs';
import Fnas from '../views/desk_ref/Fnas';
import NonPharmacoLogical from '../views/desk_ref/NonPharmacoLogical';
import Tools from '../views/desk_ref/Tools';
import PharmacoLogical from '../views/desk_ref/PharmacoLogical';
import DeskRef from '../views/desk_ref/DeskRef';
import Assessment from '../views/assessment/Assessment';
import Training from '../views/training/Training';
import Faqs from '../views/desk_ref/Faqs';
import PatientList from '../views/assessment/PatientList';
import PatientHistoryList from '../views/assessment/PatientHistoryList';
import Notification from '../views/training/notification';
import Calendar from '../views/training/calendar';
import Score from '../views/training/score';
import Profile from '../views/training/profile';
import Course from '../views/training/course';

import { Route, Router, IndexRedirect, browserHistory } from 'react-router';
import ReactGA from 'react-ga';
import NavMessages from './navtitle';
import { smoothlyMenu } from '../components/layouts/Helpers';

ReactGA.initialize('UA-93760239-1');

function onRouteChange(prevHistory, history) {
    ReactGA.pageview(window.location.href);//GA Tracking code

    let loc = history.location;
    let pathName = loc.pathname;
    let subPath = pathName.substr(0, pathName.lastIndexOf("/"));
    if (!subPath) {
        subPath = pathName;
    }

    if (pathName && pathName.length > 0 && pathName.split('/').length > 3) {
        pathName = subPath;
    }

    let title = NavMessages.titles[subPath];
    let subtitle = NavMessages.subtitles[pathName];

    localStorage.setItem("HeaderTitle", title);
    localStorage.setItem("SubTitle", subtitle);

    if (jQuery(window).width() <= 768) {
        $("body").removeClass("mini-navbar");
        smoothlyMenu();
    }
    if ($("body").hasClass("mini-navbar")) {
        $("body").removeClass('cust-fix-titlebar');
    }
    else {
        $("body").addClass('cust-fix-titlebar');
    }
}

export default (

    <Router history={browserHistory} onChange={onRouteChange} >
        <Route path="/" component={LoginView}>
            <IndexRedirect to="/login" />
            <Route path="login" component={LoginView}> </Route>
        </Route>
        <Route path="/" component={ForgotPasswordView}>
            <IndexRedirect to="/login" />
            <Route path="/forgotPassword" component={ForgotPasswordView}> </Route>
        </Route>
        <Route component={EnsureLoggedInContainer}>
            <Route path="/mainScreen" component={Main}>
                <Route path="/main" component={MainView}> </Route>
                <Route path="/training" component={Training}> </Route>
                <Route path="/training/notification" component={Notification}> </Route>
                <Route path="/training/calendar" component={Calendar}> </Route>
                <Route path="/training/score" component={Score}> </Route>
                <Route path="/training/bookmark" component={Profile}> </Route>
                <Route path="/training/course" component={Course}> </Route>

                <Route path="/assessment" component={Assessment} Title="Assessment" > </Route>
                <Route path="/assessment/perform-assessment" component={PatientList}></Route>
                <Route path="/assessment/perform-assessment/:patientId" component={PerformAssessment}> </Route>
                <Route path="/assessment/chart" component={Chart}> </Route>
                <Route path="/desk_ref" component={DeskRef}> </Route>
                <Route path="/assessment/history" component={PatientHistoryList}> </Route>
                <Route path="/assessment/history/:patientId" component={History}> </Route>
                <Route path="/desk_ref/nas-info" component={NasInfo}> </Route>
                <Route path="/desk_ref/drugs" component={Drugs}> </Route>
                <Route path="/desk_ref/screening" component={Screening}> </Route>
                <Route path="/desk_ref/guideLine" component={GuideLine}> </Route>
                <Route path="/desk_ref/signs" component={Signs}> </Route>
                <Route path="/desk_ref/fnas" component={Fnas}> </Route>
                <Route path="/desk_ref/non_pharmacological" component={NonPharmacoLogical}> </Route>
                <Route path="/desk_ref/tools" component={Tools}></Route>
                <Route path="/desk_ref/pharmacological" component={PharmacoLogical}></Route>
                <Route path="/desk_ref/faqs" component={Faqs}></Route>
            </Route>
        </Route>
    </Router>

);