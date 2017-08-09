'use strict';
var isBrowser = document.URL.indexOf('http://') > -1 || document.URL.indexOf('https://') > -1;

var url = location.href.indexOf('localhost') > -1 ? "http://localhost:8000/" : "http://tracon.hara-apple.com:8000/"
const api = 'api/';

module.exports = {
    Login: url + 'Login',
    AssessmentForm: url + api + 'assessment/perform_assessment',
    NasInfo: url + api + 'desk_ref/nas_info',
    Drugs: url + api + 'desk_ref/drugs',
    Screening: url + api + 'desk_ref/screening',
    GuideLine: url + api + 'desk_ref/guideline',
    Signs: url + api + 'desk_ref/signs',
    NonPharmacoLogical: url + api + 'desk_ref/non_pharmacological',
    Tools: url + api + 'desk_ref/tools',
    PharmacoLogical: url + api + 'desk_ref/pharmacological',
    PatientDetail: url + api + 'patientdetail',
    Assessments: url + api + 'assessments',
    ForgotPassword: url + 'forgotpassword',
    Faq: url + api + 'desk_ref/faq'
};