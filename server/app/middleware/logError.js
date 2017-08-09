const Moment = require('moment');
var request = require('request');


function PostData(data, cb) {
    // Build the post string from an object
    request.post({
        url: 'http://exceptionbrowser.durlabhcomputers.com/ExceptionHandler.ashx',
        form: data,
        json: true,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    },
        function (err, httpResponse, body) { /* ... */
            console.log('Response: ' + body);
            cb();
        });

}

module.exports = (err, request, res, next) => {
    var metaData = {
        rawurl: request.path,
        exception: err.stack,
        UserAgent: request.headers['user-agent'],
        QueryString: request.query,
        Location: 'TracOn',
        DateTime: Moment().format('MM/DD/YYYY hh:mm:ss TT'),
        DateTimeUTC: Moment().format('MM/DD/yyyy hh:mm:ss TT'),
        MachineName: 'TracOn'
    }
    PostData(metaData, next);

}