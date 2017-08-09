import React, { Component } from 'react';
import connectionService from '../../Services/ConnectionService';
import ErrorMessage from '../../config/Message';
import Datetime from 'react-datetime';
import DateUtil from '../../util/dateUtil';
import Table from 'rc-table';
import Moment from 'moment';
import SweetAlert from 'sweetalert-react';
import Title from '../../config/titles';
import Auth from '../../services/Auth';
import Util from '../../util/index';
import Loader from 'react-loader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

require('rc-table/assets/index.css');

const AxisLabel = ({ axisType, x, y, width, height, children }) => {
    const isVert = axisType === 'yAxis';
    const rot = isVert ? -90 : 0;
    const cx = isVert ? -height / 2 : x + (width / 2);
    const cy = isVert ? y : y + (height / 2) + 14;
    return (
        <text x={cx} y={cy} transform={`rotate(${rot})`} textAnchor="middle">
            {children}
        </text>
    );
};

const NotAxisTickButLabel = props => (<g transform={"translate( " + props.x + "," + props.y + " )"}><text x={0} y={0} dy={16} fontFamily="Roboto" fontSize="10px" textAnchor="end" fill={props.color || "#8884d8"} transform={"rotate(" + props.angle + ")"} >{props.payload.value}</text></g>);

class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientData: null,
            patientId: 0,
            columns: [],
            data: [],
            startTime: Moment(new Date()).add(-1, 'days'),
            endTime: Moment(new Date()),
            showAlert: false,
            showChart: true,
            noResult: false,
            errorText: ""
        };
        document.title = Title.History;
    }

    componentDidMount() {
        console.log(this.props.params.patientId);
        this.setState({ patientId: Number(this.props.params.patientId) });
        this.getAssessments(Number(this.props.params.patientId));
        window.addEventListener('popstate', this.hideAlert);
    }
    componentWillUnmount() {
        window.removeEventListener('popstate', this.hideAlert);
    }
    hideAlert = () => {
        this.setState({ showAlert: false });
    };
    transformData(responseJson) {
        if (responseJson.assetRecTime.length > 0) {
            var assetRecTime = responseJson.assetRecTime;
            var assessDetails = responseJson.assessDetails
            var groups = responseJson.groups;
            var columns = [], data = [], rechartData = [];

            columns.push({ title: 'Total', dataIndex: 'title', key: -1, width: 100, fixed: 'left' });

            for (var i = 0, len = assetRecTime.length; i < len; i++) {
                columns.push({
                    title: Moment.utc(assetRecTime[i].Start_time).format("MM/DD HH:mm"),
                    children: [{ title: assetRecTime[i].Score, dataIndex: 'col' + i, key: assetRecTime[i].ID }
                    ]
                });
                rechartData.push({ 'StartDate': Moment.utc(assetRecTime[i].Start_time).format("MM/DD h:mm a"), 'Score': assetRecTime[i].Score });
            }

            //loop over groups
            for (var j = 0; j < groups.length; j++) {
                var row = { title: groups[j].GroupName, key: groups[j].Group_ID };
                for (var i = 0, len = assetRecTime.length; i < len; i++) {
                    var ad = assessDetails.find(t => {
                        return t.Assess_group_id == groups[j].Group_ID && t.time_id == assetRecTime[i].ID
                    });
                    ad = ad || {};
                    row['col' + i] = ad.Value
                }
                data.push(row);
            }
            this.setState({
                showChart: true,
                noResult: false,
                columns: columns,
                data: data,
                rechartData: rechartData,
                patientData: responseJson.patient,
                isLoading: false
            });
        }
        else {
            this.setState({ showChart: false, noResult: true, patientData: responseJson.patient, isLoading: false });
        }
    }

    getAssessments(patientId) {
        var me = this;
        if (patientId === 0) {
            this.setState({ showAlert: true, errorText: "Please select patient" });
            return;
        }

        if (this.state.startTime == null || this.state.startTime == "" || !this.state.startTime._isValid) {
            this.setState({ showAlert: true, errorText: 'Please select start date / time.' });
            return;
        }

        if (this.state.endTime == null || this.state.endTime == "" || !this.state.endTime._isValid) {
            this.setState({ showAlert: true, errorText: 'Please select end date / time.' });
            return;
        }

        if (this.state.endTime < this.state.startTime) {
            this.setState({ showAlert: true, errorText: 'end date / time can not be less than start time.' });
            return;
        }
        this.setState({ isLoading: true });
        var params = { patientId: patientId, startTime: this.state.startTime.format(DateUtil.fullDateFormat), endTime: this.state.endTime.format(DateUtil.fullDateFormat) };

        fetch(connectionService.Assessments, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + Auth.getToken()
            },
            body: JSON.stringify(params)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success) {
                    me.transformData(responseJson);
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
    onDateChange(field, selectedDate) {
        if (field === 'startTime') {
            this.setState({ startTime: selectedDate });
        }
        else {
            this.setState({ endTime: selectedDate });
        }
    }
    onClick() {
        this.setState({ showAlert: false });
    }
    getAspect() {
        if (jQuery(window).width() < 768) {
            return 1.3;
        }
        else if (jQuery(window).width() >= 768 && jQuery(window).width() < 1024) {
            return 2.3;
        }
        else {
            return 4.0;
        }
    }

    customDateFieldFocus(event) {
        var id = event.target.id;
        if (id == 'start') {
            $('#nativeStartDate').focus();
        }
        else {
            $('#nativeEndDate').focus();
        }
    }

    onCustomDateFieldChange(event) {
        event.preventDefault();
        var id = event.target.id;
        var value = event.target.value;
        if (id === 'nativeStartDate') {
            this.setState({ startTime: Moment(value) });
        }
        else {
            this.setState({ endTime: Moment(value) });
        }

        console.log(value);

        this.setState({ startDate: this.state.startDate });
    }
    render() {
        let patient = this.state.patientData;
        let patientName = '';
        if (patient) {
            patientName = patient.First_name + ' ' + patient.Last_name;
        }
        let startTime = '', endTime = ''
        if (this.state.startTime) {
            startTime = this.state.startTime.format("YYYY-MM-DDTHH:mm");
        }
        if (this.state.endTime) {
            endTime = this.state.endTime.format("YYYY-MM-DDTHH:mm");
        }

        return (
            <div>
                <Loader loaded={!this.state.isLoading}></Loader>
                <div className="row assess-bar resp-fix-hs">
                    <div className="col-lg-12">
                        <div className="history-ibox">
                            <label className="cust-hlf text-center control-label">{patientName} </label>
                            <div className="text-center cust-hlf">
                                <button className="btn btn-primary" onClick={this.getAssessments.bind(this, Number(this.props.params.patientId))} >
                                    <i className="fa fa-line-chart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12 form-group">
                        <div className="col-lg-10">
                            {Util.mobileAndTabletcheck() ?
                                <div className="input-group">
                                    <span className="input-group-addon" ><i className="fa fa-calendar" id="start" onClick={this.customDateFieldFocus.bind(this)}></i></span>
                                    <input type="datetime-local" className="form-control native-datetime" id="nativeStartDate" name="nativeStartDate"
                                        value={startTime} onChange={this.onCustomDateFieldChange.bind(this)} />
                                </div> :
                                <div className="input-group">
                                    <span className="input-group-addon" onClick={() => { this.start.focus() }}><i className="fa fa-calendar"></i></span>
                                    <Datetime onChange={this.onDateChange.bind(this, 'startTime')} defaultValue={Moment(new Date()).add(-1, 'days')}
                                        inputProps={{ placeholder: "Start Date / Time", ref: (input) => { this.start = input; } }} />
                                </div>
                            }
                        </div>
                        <div className="col-lg-10">
                            {Util.mobileAndTabletcheck() ?
                                <div className="input-group m-t-xs">
                                    <span className="input-group-addon" ><i className="fa fa-calendar" id="end" onClick={this.customDateFieldFocus.bind(this)}></i></span>
                                    <input type="datetime-local" className="form-control native-datetime" id="nativeEndDate" name="nativeEndDate"
                                        value={endTime} onChange={this.onCustomDateFieldChange.bind(this)} />
                                </div> :
                                <div className="input-group m-t-xs">
                                    <span className="input-group-addon" onClick={() => { this.end.focus() }}><i className="fa fa-calendar"></i></span>
                                    <Datetime onChange={this.onDateChange.bind(this, 'endTime')} defaultValue={Moment(new Date())}
                                        inputProps={{ placeholder: "End Date / Time", ref: (input) => { this.end = input; } }} />
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="wrapper wrapper-content assess-history row">
                    <div className="ibox float-e-margins">
                        <div className="ibox-content">
                            <div className="form-horizontal">
                                {this.state.showChart ?
                                    <div>
                                        <div>
                                            <ResponsiveContainer width='100%' aspect={this.getAspect()}>
                                                <LineChart data={this.state.rechartData}
                                                    margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
                                                    <XAxis stroke="#00b4cd" tick={<NotAxisTickButLabel angle={-45} />} dataKey="StartDate" />
                                                    <YAxis label={<AxisLabel axisType='yAxis'>Score</AxisLabel>} />
                                                    <Tooltip />
                                                    <ReferenceLine y={8} stroke="red" label="8" />
                                                    <ReferenceLine y={12} stroke="green" label="12" alwaysShow />
                                                    <Line type="linear" dataKey="Score" stroke="#8884d8" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div>
                                            <Table columns={this.state.columns} data={this.state.data} />
                                        </div>
                                    </div> : null
                                }
                                {this.state.noResult ? <h3 className="text-center text-danger">No result found for selected period.</h3> : null}

                                <SweetAlert show={this.state.showAlert} title="Error" text={this.state.errorText} onConfirm={this.onClick.bind(this)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
    }
}
export default History