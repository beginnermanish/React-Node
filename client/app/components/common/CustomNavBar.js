import React from 'react';
import { Link, Location, browserHistory } from 'react-router';

class CustomNavBar extends React.Component {

    render() {
        return (
            localStorage.SubTitle != "undefined" ?
                (<div className="row border-bottom top-fix-head">
                    <div className="white-bg text-center head-title">
                        <i className="fa fa-angle-left back-glyph" onClick={browserHistory.goBack}></i>
                        <div className="cust-nav">{localStorage.SubTitle}</div>
                    </div>
                </div>) : null

        )
    }
}

export default CustomNavBar