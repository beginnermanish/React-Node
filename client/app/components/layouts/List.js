import React, { Component } from 'react';

class List extends Component {
    onItemClick(item) {
        this.props.onListItemClick(item);
    }
    onSearchClick(current) {
        var value = current.target.value.toLowerCase();
        this.props.onPatientSearchClick(value);
    }
    render() {
        const { data, onListItemClick, showIcon } = this.props;
        return (
            <div className="wrapper wrapper-content">
                <div className="row">
                    <div className="ibox float-e-margins m-t-sm">
                        <div className="ibox-content">
                            <div className="form-group m-b-xs">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-search"></i></span>
                                    <input type="text" className="form-control" placeholder="Search Patient" onChange={this.onSearchClick.bind(this)} />
                                </div>
                            </div>
                            <ul className="todo-list small-list content-font">
                                {data.map(function (item, index) {
                                    return (<li onClick={this.onItemClick.bind(this, item)} key={index}>
                                        <span className="m-l-xs">{item.Name}</span>
                                        {showIcon ? (item.IsCompleted === 0 ? <span className="fr m-r-xs"><strong>{item.Score}</strong></span> : <span className="fr fa fa-plus-circle large-plus"></span>) : null}
                                    </li>)
                                }.bind(this))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default List