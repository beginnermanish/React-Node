import React, { Component } from 'react';
import connectionService from '../../Services/ConnectionService';
import ErrorMessage from '../../config/Message';
import Datetime from 'react-datetime';
import Auth from '../../services/Auth';
import DateUtil from '../../util/dateUtil';
import SweetAlert from 'sweetalert-react';
import Title from '../../config/titles';
import Moment from 'moment';
import Util from '../../util/index';
import Loader from 'react-loader';

class CheckList extends React.Component {
    onClick(index) {
        if (this.props.onSelect) {
            var newValue = this.props.options[index].value;
            var itemId = this.props.options[index].itemId;
            var oldValue = this.props.value;
            if (newValue === oldValue) {
                newValue = null;
            }
            this.props.onSelect(newValue, oldValue, itemId);
        }
    }
    onInfoClick(index) {
        if (this.props.infoIconOnClick) {
            var newValue = this.props.options[index].value;
            var itemId = this.props.options[index].itemId;
            var oldValue = this.props.value;
            if (newValue === oldValue) {
                newValue = null;
            }
            this.props.infoIconOnClick(newValue, oldValue, itemId);
        }
    }
    render() {
        const { options, value } = this.props;
        return (<table className="checklist-table">
            <tbody>
                {options.map((option, index) => {
                    return (<tr key={index}>
                        <td className='checkbox-td' onClick={this.onClick.bind(this, index)}>
                            <div className={option.value == value ? "checked" : "unchecked"}></div>
                        </td>
                        <td onClick={this.onClick.bind(this, index)}>{option.text}</td>
                        {index == 0 ? <td onClick={this.onInfoClick.bind(this, index)}><div className="fr-sign"><i className="fa fa-info-circle"></i></div></td> : <td></td>}
                    </tr>)
                })}
            </tbody>
        </table>);
    }
}

class PerformAssessment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            FormFields: [],
            ScoreValue: 0,
            loading: false,
            patientData: null,
            assessRecord: {},
            assessmentValues: [],
            startDate: Moment(),
            minDate: Moment().subtract(4, 'hour'),
            show: false,
            sweetAlertTitle: "",
            sweetAlertText: null,
            sweetAlertSuccess: false,
            isSubmitted: false,
            isOldAssessment: false,
            isLoading: false
        };
        document.title = Title.PerformAssessment;
    }
    onSelect(groupId, newValue, oldValue, itemId) {
        const { assessmentValues } = this.state;
        const assessmentValue = this.getAssessment(groupId, assessmentValues);
        Object.assign(assessmentValue, { value: newValue, expanded: false, itemId: itemId });
        const groupIndex = assessmentValues.indexOf(assessmentValue);
        if (groupIndex < (assessmentValues.length - 1)) {
            assessmentValues[groupIndex + 1].expanded = true;
        }
        this.setState({ assessmentValues: assessmentValues, ScoreValue: this.getTotalScore(assessmentValues) });
    }
    setProperty(groupId, values) {
        const { assessmentValues } = this.state;
        const assessmentValue = this.getAssessment(groupId, assessmentValues);
        Object.assign(assessmentValue, values);
        this.setState({ assessmentValues: assessmentValues, ScoreValue: this.getTotalScore(assessmentValues) });
    }

    onValueChange(groupId, itemId, event) {
        this.setProperty(groupId, { value: event.target.value, itemId: itemId, type: 'number' });
    }

    loadInitialData() {
        var currentLocation = this.props.location.pathname, patientId = 0;
        if (currentLocation.length > 0) {
            var parts = currentLocation.split('/');
            var patientId = parts[parts.length - 1];
            if (Number(patientId) < 1) {
                this.setState({ show: true, sweetAlertSuccess: false, sweetAlertTitle: 'Error', sweetAlertText: 'Please select Patient.' });
                return;
            }
        }

        fetch(connectionService.AssessmentForm + '?PatientId=' + patientId, {
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
                    var FormFields = responseJson.FormFields;
                    var values = responseJson.assetDetails;
                    var assessmentValues = [];
                    var assessRecord = responseJson.assessRecord;

                    if (assessRecord) {
                        var startTime = assessRecord.Start_time.replace('.000Z', '') // Remove timestamp for local parsing
                        this.state.startDate = Moment(startTime);
                        this.state.isOldAssessment = true;
                    } else {
                        this.state.startDate = Moment();
                    }

                    assessmentValues = FormFields.map((group, groupIndex) => {
                        var assess = values.find(t => t.Assess_group_id == group.groupId), valObj = {};
                        if (assess) {
                            valObj = { itemId: assess.Assess_item_id, value: assess.Value, type: group.type };
                        }
                        return Object.assign({ "groupId": group.groupId }, valObj);
                    });
                    this.setState({ FormFields, assessmentValues: assessmentValues, patientData: responseJson.patient, ScoreValue: this.getTotalScore(assessmentValues) });
                }
                else {
                    alert(ErrorMessage.ServerError);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    componentDidMount() {
        this.loadInitialData();
        this.timer = setInterval(this.autoSave.bind(this), 30 * 1000);
        window.addEventListener('popstate', this.hideAlert);
    }
    componentWillUnmount() {
        clearInterval(this.timer);

        if (!this.state.isSubmitted)
            this.handleSubmit();
        window.removeEventListener('popstate', this.hideAlert);
    }
    hideAlert = () => {
        this.setState({ show: false });
    };

    autoSave() {
        if (this.state.patientData && this.state.startDate) {
            this.handleSubmit();
        }
    }

    handleSubmit(event) {
        const user = Auth.getUser();

        if (!user) {
            this.setState({ show: true, sweetAlertSuccess: false, sweetAlertTitle: 'Error', sweetAlertText: 'Session timeout. Please log in again.' });
            return;
        }

        if (!this.state.patientData) {
            this.setState({ show: true, sweetAlertSuccess: false, sweetAlertTitle: 'Error', sweetAlertText: 'Please select user' });
            return;
        }

        if (!this.state.startDate || !this.state.startDate._isValid) {
            this.setState({ show: true, sweetAlertSuccess: false, sweetAlertTitle: 'Error', sweetAlertText: 'Please select assessment date.' });
            return;
        }

        /*if (!this.state.isOldAssessment && Datetime.moment().diff(this.state.startDate, 'hours') > 4) {
            this.setState({ show: true, sweetAlertSuccess: false, sweetAlertTitle: 'Error', sweetAlertText: 'Time can not be more than 4 Hours old from current time.' });
            return;
        }*/
        if (event) {
            this.setState({ isLoading: true });
        }
        const { assessmentValues } = this.state;
        const assessRecord = {
            Patient_id: this.state.patientData.ID,
            User_id: user.UserId,
            Start_time: this.state.startDate.format(DateUtil.fullDateFormat),
            End_time: Datetime.moment().format(DateUtil.fullDateFormat),
            Score: this.state.ScoreValue || 0,
            SubmittedOn: event ? Datetime.moment().format(DateUtil.fullDateFormat) : null
        };

        var params = { data: [] };

        for (var i = 0, len = assessmentValues.length; i < len; i++) {
            if (assessmentValues[i].itemId) {
                params.data.push({ Assess_item_id: assessmentValues[i].itemId, Value: assessmentValues[i].value, Assess_group_id: assessmentValues[i].groupId });
            }
        }

        params.assessRecord = assessRecord;

        fetch(connectionService.AssessmentForm, {
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
                    if (event) {
                        if (responseJson.alreadyExist) {
                            this.setState({ show: true, isLoading: false, sweetAlertSuccess: false, sweetAlertTitle: 'Error', sweetAlertText: 'Assessment already exist for the patient for same time.' });
                        }
                        else {
                            this.setState({ show: true, isLoading: false, sweetAlertSuccess: true, sweetAlertTitle: 'Success', sweetAlertText: 'Assessment Saved Successfully' });
                        }

                    }
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

        if (event)
            event.preventDefault();

    }
    getTotalScore(values) {
        var count = 0;
        for (var item in values) {
            var data = values[item];
            if (data.value && data.type !== 'number') {
                count += Number(data.value);
            }
        }
        return count;
    }
    valid(current) {
        var yesterday = Datetime.moment().subtract(4, 'hour').format(DateUtil.shortDateFormat);//enable last day date only if the last 4 hours comes in yesterday time.
        current = current.format(DateUtil.shortDateFormat);
        return Moment(current).isSameOrAfter(yesterday);
    }
    onDateChange(selectedDate) {
        this.setState({ startDate: selectedDate });
    }
    getAssessment(groupId, assessmentValues) {
        if (!assessmentValues) {
            assessmentValues = this.state.assessmentValues;
        }
        var assessmentValue = assessmentValues.find(t => t.groupId == groupId);
        if (!assessmentValue) {
            assessmentValue = { groupId: groupId };
            assessmentValues.push(assessmentValue);
        }
        return assessmentValue;
    }
    toggleInfo(groupId) {
        let showInfo = this.getAssessment(groupId).showInfo === true;
        this.setProperty(groupId, { showInfo: !showInfo });
    }
    onExpandToggle(groupId) {
        var assessment = this.getAssessment(groupId);
        let expanded = assessment.expanded === true;
        let showInfo = assessment.showInfo === true;
        if (expanded === true & showInfo == true) {
            showInfo = false;
        }
        this.setProperty(groupId, { expanded: !expanded, showInfo: showInfo });
    }
    onSuccessConfirm() {
        this.setState({ show: false, isSubmitted: true });
        if (this.state.sweetAlertSuccess) {
            this.context.router.replace('assessment/perform-assessment');
        }
    }
    onCustomDateFieldChange(event) {
        event.preventDefault();
        var startTime = event.target.value;
        console.log(startTime);
        this.state.startDate = Moment(startTime);
        this.setState({ startDate: this.state.startDate });
    }
    customDateFieldFocus(event) {
        $('#nativeStartDate').focus();
    }
    render() {
        var formFields = this.state.FormFields;
        const selections = this.state.assessmentValues;
        let patient = this.state.patientData;
        let patientName = '';
        if (patient) {
            patientName = patient.First_name + ' ' + patient.Last_name;
        }
        let startDate = '';
        if (this.state.startDate) {
            startDate = this.state.startDate.format("YYYY-MM-DDTHH:mm");
        }

        let minDate = this.state.minDate.format("YYYY-MM-DDTHH:mm");

        return (
            <div>
                <Loader loaded={!this.state.isLoading}></Loader>
                <div className="row assess-bar">
                    <div className="col-lg-12">
                        <div className="cust-hlf text-center"><label>{patientName}</label> </div>
                        <div className="cust-hlf text-center"><label>Score: </label> {this.state.ScoreValue}</div>
                    </div>
                    <div className="col-lg-12">
                        <div className="col-md-10 col-xs-10">
                            {Util.mobileAndTabletcheck() ?
                                <div className="input-group">
                                    <span className="input-group-addon" ><i className="fa fa-calendar" onClick={this.customDateFieldFocus.bind(this)}></i></span>
                                    <input type="datetime-local" className="form-control native-datetime" id="nativeStartDate" name="startDateTimeRes" value={startDate} onChange={this.onCustomDateFieldChange.bind(this)} min={minDate} />
                                </div> :
                                <div className="input-group">
                                    <span className="input-group-addon" onClick={() => { this.start.focus() }}><i className="fa fa-calendar"></i></span>
                                    <Datetime value={this.state.startDate} inputProps={{ placeholder: 'Date / Time', ref: (input) => { this.start = input; } }} isValidDate={this.valid} onChange={this.onDateChange.bind(this)} />
                                </div>
                            }
                        </div>
                        <div className="col-md-2 col-xs-2 text-center">
                            <button className="btn btn-primary" type="button" onClick={this.handleSubmit.bind(this)}><i className="fa fa-save"></i> </button>
                        </div>
                    </div>
                </div>
                <div className="wrapper wrapper-content assess-content">
                    <div className="row">
                        <div className="ibox float-e-margins">
                            <div className="ibox-content">
                                <form className="form-horizontal">
                                    <div className="panel-body form-group pd0">
                                        <div className="panel-group panel-custom">
                                            {
                                                formFields.map((group, groupIndex) => {
                                                    var displayComponent = null;
                                                    var selectedInfo = selections.find(t => t.groupId === group.groupId) || {};
                                                    let { selectedId, value, expanded } = selectedInfo;
                                                    let infoIcon = <div onClick={this.toggleInfo.bind(this, group.groupId)} className="fr-sign"><i className="fa fa-info-circle"></i></div>
                                                    if (expanded === true) {
                                                        if (value === null || value === undefined) {
                                                            value = "";
                                                        }
                                                        if (group.options) {
                                                            displayComponent = <CheckList options={group.options} value={value} infoIconOnClick={this.toggleInfo.bind(this, group.groupId)} onSelect={this.onSelect.bind(this, group.groupId)} />
                                                        } else if (group.type === "number") {
                                                            displayComponent = <div><input className="form-control" type="number" value={value} onChange={this.onValueChange.bind(this, group.groupId, group.itemId)} /></div>
                                                        }
                                                    }

                                                    return (
                                                        <div className={"panel " + (value > 0 ? "panel-primary" : "panel-default")} key={group.groupId}>
                                                            <div className="panel-heading panel-heading-cust" onClick={this.onExpandToggle.bind(this, group.groupId)}>
                                                                <h5 className="panel-title">{group.title}{value > 0 && group.type !== "number" ? <span className="fr">Score: {value}</span> : ""}</h5>
                                                            </div>
                                                            <div className={expanded ? "panel-collapse collapse in" : ""}>
                                                                <div className={expanded ? "panel-body" : ""}>
                                                                    {expanded && group.type === "number" ? infoIcon : null}
                                                                    {displayComponent}
                                                                    {expanded ? (selectedInfo.showInfo ? <div className="groupInfo">{group.info}</div> : null) : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                    <SweetAlert show={this.state.show} title={this.state.sweetAlertTitle} text={this.state.sweetAlertText} onConfirm={this.onSuccessConfirm.bind(this)} />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

PerformAssessment.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default PerformAssessment