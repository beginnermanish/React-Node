import React, { Component } from 'react';
import SwipeableViews from 'react-swipeable-views';
import SwipeableTabs from 'react-swipeable-tabs';

var sanitizeHtml = require('sanitize-html');

class CarouselView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showParent: true,
            childData: null,
            index: 0
        };
    }

    componentDidUpdate() {
        $(".tabs-container").on('click', 'a[href^="http"]', function (e) {
            var url = $(this).attr('href');
            window.open(url, '_system');
            e.preventDefault();
        });
    }

    onItemClick(item) {
        window.scrollTo(0, 0);
        this.showNavBar(false);
        this.setState({ showParent: false, childData: item, index: 0 });
    }

    handleChangeIndex = (index) => {
        window.scrollTo(0, 0);
        this.setState({ index });
        this.pauseVideo();
    }
    handleClickTab = (item, index) => {
        window.scrollTo(0, 0);
        this.setState({ index: index });
        this.pauseVideo();
    }
    pauseVideo() {
        if ($('video').length > 0) {
            $('video')[0].pause();
        }
    }
    onGoBackButton() {
        window.scrollTo(0, 0);
        this.showNavBar(!this.state.showParent);
        this.setState({ showParent: true });
    }

    showNavBar(showNavBar) {
        this.props.showNavBar(showNavBar);
    }

    repairSrc(content) {
        if (window.cordova && content) {
            return content.replace(/images\//g, localStorage.baseURL + 'images/');
        }
        return content;
    }

    render() {
        const { data, onListItemClick, title, tabs, showNavBar, sections } = this.props;
        var field = this.state.childData;
        var index = this.state.index;

        var items = [];
        var me = this;
        me.items = items;
        if ((sections || (data && data.length > 0)) && this.state.childData) {
            tabs.tabItems = tabs.tabItems.filter(function (tab) {
                if (tab.HideIfNull) {
                    var dataItem = this.state.childData;
                    if (dataItem[tab.DataField]) {
                        this.items.push({ title: tab.Title });
                        return tab;
                    }
                }
                else {
                    this.items.push({ title: tab.Title });
                    return tab;
                }
            }.bind(this));
        }


        return (<div>
            {this.state.showParent == false ?
                (<div className="row border-bottom top-fix-head">
                    <div className="white-bg text-center head-title">
                        <i className="fa fa-angle-left back-glyph" onClick={this.onGoBackButton.bind(this)}></i>
                        <div className="cust-nav"> {localStorage.SubTitle + " - " + field[tabs.MainHeaderColumn]}</div>
                    </div>
                </div>) : null}
            <div className="wrapper wrapper-content">
                <div className="row">
                    <div className="ibox float-e-margins">
                        <div className="ibox-content">
                            <div>
                                {this.state.showParent ?
                                    <div>
                                        {sections ?
                                            <div className="sub-section">
                                                {sections.map(function (tabItem, itemIndex) {
                                                    return <div key={itemIndex}>
                                                        <strong>{tabItem.title}</strong>
                                                        <ul className="todo-list m-t-xs small-list content-font" >
                                                            {tabItem.items.map(function (item, itemIndex) {
                                                                return (item[tabs.MainHeaderColumn] ? <li onClick={this.onItemClick.bind(this, item)} key={itemIndex}>
                                                                    <span className="m-l-xs">{item[tabs.MainHeaderColumn]}</span>
                                                                </li> : null)
                                                            }.bind(this))}
                                                        </ul>
                                                        <br />
                                                    </div>
                                                }, this)}
                                            </div> :
                                            <ul className="todo-list m-t-sm small-list content-font">
                                                {(data && data.length > 0) ? data.map(function (item, itemIndex) {
                                                    return (<li onClick={this.onItemClick.bind(this, item)} key={itemIndex}>
                                                        <p className="m-l-xs m-b-none" dangerouslySetInnerHTML={{
                                                            __html: this.repairSrc(item[tabs.MainHeaderColumn])
                                                        }}>
                                                        </p>
                                                    </li>)
                                                }.bind(this)) : null}
                                            </ul>
                                        }
                                    </div> :
                                    <div className="tabs-container">
                                        <ul className="nav nav-tabs">
                                            <SwipeableTabs noFirstLeftPadding={false} noLastRightPadding={false} fitItems={false}
                                                alignCenter={false}
                                                borderWidthRatio={1}
                                                itemClassName={'swipe-tab-li'}
                                                activeItemIndex={this.state.index}
                                                onItemClick={this.handleClickTab.bind(this)}
                                                items={items} borderPosition="top" borderThickness={2} borderColor="#4dc4c0"
                                                activeStyle={{ color: '#4dc4c0' }} style={{ paddingTop: '0px' }}
                                            />
                                        </ul>
                                        <div className="tab-content">
                                            <SwipeableViews index={index} onChangeIndex={this.handleChangeIndex}>
                                                {tabs.tabItems.map(function (tab, itemIndex) {
                                                    return (
                                                        <div id={"tab-" + itemIndex} className={itemIndex == 0 ? "tab-pane active" : "tab-pane"} key={itemIndex}>
                                                            <div className="panel-body" dangerouslySetInnerHTML={{
                                                                __html: me.repairSrc(field[tab.DataField])
                                                            }}>
                                                            </div>
                                                        </div>)
                                                })}
                                            </SwipeableViews>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default CarouselView