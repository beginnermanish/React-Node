import React, { Component } from 'react';
import connectionService from '../../Services/ConnectionService';
import ErrorMessage from '../../config/Message';
import { Link, Location, browserHistory } from 'react-router';
import Title from '../../config/titles';
import util from '../../util';

class Assessment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuItems: []
        }

        document.title = Title.Assessment;
    }

    componentWillMount() {
        if (localStorage.menuData) {
            var data = JSON.parse(localStorage.menuData),
                menus = data.filter(function (e) { return e.label == 'Assessment' });
            this.state.menuItems = menus[0].items;
        }
    }

    onClickItem(item, context) {
        item = item.item;
        var path = item.Menu_name.toLowerCase() + "/" + item.Name.toLowerCase();
        path = path.replace(/ /g, '-');
        this.context.router.push('/' + path);
    }

    renderItem(item) {
        if (item && item.length > 0)
            return (
                item.map(function (item, i) {
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
                                            {this.renderItem(this.state.menuItems)}
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

Assessment.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Assessment;