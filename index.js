const express = require('express');
const bodyParser = require('body-parser');
var port = process.env.PORT || 8000;
var passport = require('passport');
var request = require('request');
var dateFormat = require('dateFormat');
require('./server/config/passport')(passport); // pass passport for configuration

function postData(data, cb) {
	request.post({
		url: 'http://SomeErrorHandlingService',
		form: data,
		json: true,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	},
		function (err, httpResponse, body) { /* ... */
			console.log('Response: ' + body);
			//cb();
		});
}

var app = express();

const authCheckMiddleware = require('./server/app/middleware/auth-check');
app.use('/api', authCheckMiddleware);

const apiRoutes = require('./server/app/routes/api');



app.use(express.static('./server/static/'));
app.use(express.static('./client/public/'));

// set up our express application
app.use(bodyParser.urlencoded({ extended: false })); // get information from html forms
app.use(bodyParser.json())

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(passport.initialize());
app.use('/api', apiRoutes);

process.on('uncaughtException', function (err) {
	var now = new Date();
	var metaData = {
		exception: err.stack,
		VirtualPath: 'tracon',
		SystemPath: 'tracon',
		Location: 'TracOn',
		DateTime: dateFormat(now, 'mm/dd/yyyy hh:MM:ss TT'),
		DateTimeUTC: dateFormat(now, 'mm/dd/yyyy hh:MM:ss TT'),
		MachineName: 'TracOn'
	}
	postData(metaData, null);
});

// routes ======================================================================
require('./server/app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.use(function (err, req, res, next) {
	if (req.headers.host.indexOf('localhost') > -1) {
		return;
	}
	var now = new Date();

	var metaData = {
		rawurl: req.url,
		exception: err.stack,
		UserAgent: req.headers['user-agent'],
		QueryString: JSON.stringify(req.query),
		VirtualPath: 'tracon',
		SystemPath: 'tracon',
		Location: 'TracOn',
		DateTime: dateFormat(now, 'mm/dd/yyyy hh:MM:ss TT'),
		DateTimeUTC: dateFormat(now, 'mm/dd/yyyy hh:MM:ss TT'),
		MachineName: 'TracOn'
	}
	postData(metaData, null);

	next(err);
});

// launch ======================================================================
app.listen(port, () => {
	console.log('The magic happens on port ' + port);
});
