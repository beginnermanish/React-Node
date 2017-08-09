import React, { Component } from 'react';
import connectionService from '../../Services/ConnectionService';
import ErrorMessage from '../../config/Message';
import { Link, Location, browserHistory } from 'react-router';
import Title from '../../config/titles';
import util from '../../util';

class DeskRef extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuItems: [],
            deskRefItems: []
        }
        document.title = Title.DeskReference;
    }

    componentWillMount() {
        if (localStorage.menuData) {
            var data = JSON.parse(localStorage.menuData),
                menus = data.filter(function (e) { return e.label == 'Desk_ref' });
            this.state.menuItems = menus[0].items;
            this.setState({ menuItems: this.state.menuItems, deskRefItems: this.state.menuItems });
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

    onSearchTextChange(current) {
        var value = current.target.value.toLowerCase();
        let alldata = this.state.menuItems;
        let filterData = alldata.filter(function (item) {
            return item.label.toLowerCase().indexOf(value) > -1;
        });

        this.setState({ deskRefItems: filterData });

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
                                            {this.renderItem(this.state.deskRefItems)}
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

DeskRef.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default DeskRef;