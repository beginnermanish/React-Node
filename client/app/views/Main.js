import React, { Component } from 'react';
import { Link, Location, browserHistory } from 'react-router';
import Title from '../config/titles';
import util from '../util'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainMenu: []
        }
        document.title = Title.Home;
    }

    componentWillMount() {
        if (localStorage.menuData) {
            var data = JSON.parse(localStorage.menuData);
            this.state.mainMenu = data;
        }
    }

    onClickItem(item, contaxt) {
        item = item.item;
        var path = item.Name.toLowerCase();
        path = path.replace(/ /g, '-');
        this.context.router.push('/' + path);
        if ($("body").hasClass("mini-navbar")) {
            $("body").removeClass('cust-fix-titlebar');
        }
        else {
            $("body").addClass('cust-fix-titlebar');
        }
    }

    renderItem(items) {
        if (items && items.length > 0)
            return (
                items.map(function (item, i) {
                    return (<li onClick={this.onClickItem.bind(this, item)} key={i}>
                        <span className="glyphicon" aria-hidden="true">
                            <img src={util.getImageSrc('img/menu-icons/' + item.item.Icon_file + "_64.png")} />
                        </span><br />
                        <span className="glyphicon-className">{item.Caption}</span>
                    </li>)
                }, this)
            )
    }

    render() {

        return (
            <div className="wrapper wrapper-content mt0">
                <div className="row">
                    <div className="ibox float-e-margins">
                        <div className="ibox-content">
                            <div className="container bs-docs-container">
                                <div className="row">
                                    <div className="bs-glyphicons">
                                        <ul className="bs-glyphicons-list">
                                            {this.renderItem(this.state.mainMenu)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Main.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Main