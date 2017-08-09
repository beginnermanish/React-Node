import React, { Component } from 'react';
import connectionService from '../../Services/ConnectionService';
import ErrorMessage from '../../config/Message';
import Title from '../../config/titles';
import SwipeableTabs from 'react-swipeable-tabs';
import SwipeableViews from 'react-swipeable-views';
import Auth from '../../services/Auth';
import Loader from 'react-loader';

class Faqs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Faq: [],
            showParent: true,
            childData: null,
            index: 0,
            isLoading: false
        };
        document.title = Title.Faq;
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        fetch(connectionService.Faq, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + Auth.getToken()
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success) {
                    this.setState({ Faq: responseJson.Faq, isLoading: false });
                }
                else {
                    this.setState({ isLoading: false });
                    alert(ErrorMessage.ServerError);
                }
            })
            .catch((error) => {
                this.setState({ isLoading: false });
                alert(error);
            });
    }

    componentDidUpdate() {
         $(".tabs-container").on('click', 'a[href^="http"]', function (e) {
            var url = $(this).attr('href');
            window.open(url, '_system');
            e.preventDefault();
        });
    }
    onItemClick(item) {
        this.showNavBar(false);
        this.setState({ showParent: false, childData: item });
    }

    handleChangeIndex = (index) => {
        this.setState({ index });
    }
    onGoBackButton() {
        this.showNavBar(!this.state.showParent);
        this.setState({ showParent: true });
    }

    showNavBar(showNavBar) {
        this.props.showNavBar(showNavBar);
    }

    render() {
        var tabs = {
            MainHeaderColumn: "title",
            tabItems: [
                { Title: "Questions", DataFields: ["question", "answer"] },
                { Title: "Reference", DataField: "reference" },
                { Title: "Image", DataField: "Image", HideIfNull: true },
                { Title: "Video", DataField: "Video", HideIfNull: true }
            ]
        };

        var data = this.state.Faq;
        var field = this.state.childData;
        var items = [];

        if (data && (data.length > 0) && this.state.childData) {
            items = tabs.tabItems.reduce(function (result, tab) {
                if (tab.HideIfNull) {
                    var dataItem = this.state.childData.options;
                    var hasData = false;
                    for (var i = 0; i < dataItem.length; i++) {
                        if (dataItem[i][tab.DataField]) {
                            hasData = true;
                            break;
                        }
                    }
                    if (hasData) {
                        result.push({ title: tab.Title });
                    }
                }
                else {
                    result.push({ title: tab.Title });
                }
                return result;
            }.bind(this), []);
        }
        var index = this.state.index;

        return (
            <div>
                <Loader loaded={!this.state.isLoading}></Loader>
                {this.state.showParent == false ?
                    (<div className="row border-bottom top-fix-head">
                        <div className="white-bg text-center head-title">
                            <i className="fa fa-angle-left back-glyph" onClick={this.onGoBackButton.bind(this)}></i>
                            <div className="cust-nav">{localStorage.SubTitle + " - " + field[tabs.MainHeaderColumn]} </div>
                        </div>
                    </div>) : null}
                <div className="wrapper wrapper-content">
                    <div className="row">
                        <div className="ibox float-e-margins">
                            <div className="ibox-content">
                                <div>
                                    {
                                        this.state.showParent ?
                                            <ul className="todo-list m-t-sm small-list ui-sortable">
                                                {data.map(function (item, itemIndex) {
                                                    return (<li onClick={this.onItemClick.bind(this, item)} key={itemIndex}>
                                                        <span className="m-l-xs">{item[tabs.MainHeaderColumn]}</span>
                                                    </li>)
                                                }.bind(this))}
                                            </ul> : <div>
                                                <div className="tabs-container">
                                                    <ul className="nav nav-tabs">
                                                        <SwipeableTabs noFirstLeftPadding={false} noLastRightPadding={false} fitItems={false} alignCenter={false} borderWidthRatio={1}
                                                            activeItemIndex={this.state.index}
                                                            itemClassName={'swipe-tab-li'}
                                                            onItemClick={(item, index) => this.setState({ index: index })}
                                                            items={items} borderPosition="top" borderThickness={2} borderColor="#4dc4c0"
                                                            activeStyle={{ color: '#4dc4c0' }}
                                                        />
                                                    </ul>
                                                    <div className="tab-content">
                                                        <SwipeableViews index={index} onChangeIndex={this.handleChangeIndex}>
                                                            {tabs.tabItems.map(function (ctab, itemIndex) {
                                                                return (
                                                                    <div id={"tab-" + itemIndex} className={itemIndex == 0 ? "tab-pane active" : "tab-pane"} key={itemIndex}>
                                                                        <div className="panel-body">

                                                                            {field.options.map(function (currentItem, index) {
                                                                                if (typeof ctab.DataField === "string") {
                                                                                    return (
                                                                                        <div key={index} dangerouslySetInnerHTML={{
                                                                                            __html: currentItem[ctab.DataField]
                                                                                        }}></div>
                                                                                    )
                                                                                }
                                                                                else {
                                                                                    var dataFields = ctab.DataFields;
                                                                                    var question = null;
                                                                                    var ans = null;
                                                                                    var len = dataFields.length;
                                                                                    for (var i = 0; i < len; i++) {
                                                                                        if (i == 0) {
                                                                                            question = currentItem[dataFields[i]];
                                                                                        }
                                                                                        else {
                                                                                            ans = currentItem[dataFields[i]];
                                                                                        }
                                                                                    }
                                                                                    return (
                                                                                        <div className="mb10" key={index}>
                                                                                            <b className="que">Q. <span dangerouslySetInnerHTML={{
                                                                                                __html: question
                                                                                            }}></span>
                                                                                            </b>
                                                                                            <br />

                                                                                            <span className="ans">
                                                                                                A. <span dangerouslySetInnerHTML={{
                                                                                                    __html: ans
                                                                                                }}>
                                                                                                </span>
                                                                                            </span>
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </SwipeableViews>
                                                    </div>
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

export default Faqs