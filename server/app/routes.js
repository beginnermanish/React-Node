const nodemailer = require('nodemailer');
var Guid = require('guid');
var Promise = require('promise');
var connection = require('../app/connection.js');
var { AssetDetail, AssetRecTime, User, Patient } = require('../app/models');


var getAppConfig = function () {
	return new Promise(function (resolve, reject) {
		connection.query("SELECT Name, Url, TypeId FROM AppConfig WHERE IsDeleted = 0", function (err, rows) {
			if (!err) {
				resolve(rows);
			}
			else {
				console.error(err);
				reject();
			}
		});
	})
};
// app/routes.js
var menu = function (isJsonResponse, userData) {
	return new Promise(function (resolve, reject) {
		connection.query("SELECT * FROM Icon_List  WHERE \
		ModuleId in (SELECT ModuleId FROM security_rolemodule WHERE RoleId = ? AND IsDeleted = 0) AND IsActive = 1 ORDER BY ParentId, `Order`", [userData.RoleId], function (err, rows) {
				var builddata = function () {
					var source = [];
					var items = [];
					// build hierarchical source.
					if (rows && rows.length > 0) {
						for (i = 0; i < rows.length; i++) {
							var item = rows[i];
							var label = item["Name"];
							var parentid = item["ParentId"];
							var id = item["ID"];
							var caption = item["Caption"];
							if (items[parentid]) {
								var item = { parentid: parentid, label: label, item: item, Caption: caption };
								if (!items[parentid].items) {
									items[parentid].items = [];
								}
								items[parentid].items[items[parentid].items.length] = item;
								items[id] = item;
							}
							else {
								items[id] = { parentid: parentid, label: label, item: item, Caption: caption };
								source.push(items[id]);
							}
						}
					}
					return source;
				}

				var source = builddata();
				if (isJsonResponse) {
					if (!err) {
						resolve(source);
					}
					else {
						console.error(err);
						reject();
					}
				}
			});
	});
}
module.exports = function (app, passport) {
	app.post('/login', (req, res, next) => {

		return passport.authenticate('local-login', (err, userData, token) => {
			if (!userData) {
				if (token === 'IncorrectCredentialsError') {
					return res.json({
						success: false,
						message: 'Invalid credentials.'
					});
				}

				return res.json({
					success: false,
					message: 'Could not process the form.'
				});
			}

			menu(true, userData).then(function (result) {
				getAppConfig().then(function (config) {
					return res.json({
						success: true,
						message: 'You have successfully logged in!',
						token,
						user: userData,
						menu: result,
						config: config
					});
				});
			}, function (err) {
				res.json({ success: false, errorMessage: err });
			});


		})(req, res, next);
	});
	app.post('/forgotpassword', function (req, res) {
		var email = req.body.email;
		var token = req.body.token;
		var newPassword = req.body.password;

		connection.query("select * from users where email = ?", [email], function (err, rows) {

			if (rows && rows.length > 0) {
				var userId = rows[0].UserId;
				if (token) {
					var oldToken = rows[0].PasswordResetToken;
					var oldTokenGuid = new Guid(oldToken);
					var newTokenGuid = new Guid(token);

					if (!oldTokenGuid.isEmpty() && newTokenGuid.equals(oldTokenGuid)) {
						var passwordHash = User.generateHash(newPassword);
						var guidEmpty = Guid.EMPTY;
						connection.query("UPDATE users SET Password = ?, PasswordResetToken = ? WHERE UserId = ?", [passwordHash, guidEmpty, userId],
							function (err, rows) {
								return res.json({ success: true, message: 'Your password has been changed.' });
							});
					}
					else {
						return res.json({ success: false, message: 'Token has been used or expired!' });
					}
				}
				else {
					var guid = Guid.create();

					var guidValue = guid.value;
					connection.query("UPDATE users SET PasswordResetToken = ? WHERE UserId = ?", [guidValue, userId], function (err, rows) {

						if (!err) {
							//https://nodemailer.com/about/ <--Help link
							let transporter = nodemailer.createTransport({
								service: 'gmail',
								auth: {
									user: 'user@demo.com',
									pass: 'demo@2018'
								}
							});

							// setup email data with unicode symbols
							let mailOptions = {
								from: '"Password Recovery "<password@demo.com>', // sender address
								to: email, // list of receivers
								subject: 'Reset password', // Subject line
								text: 'Token for reset password is:', // plain text body
								html: '<b>Token for reset password is: </b>' + guidValue // html body
							};

							//send mail with defined transport object
							transporter.sendMail(mailOptions, (error, info) => {
								if (error) {
									return console.log(error);
								}
								return res.json({ success: true, message: 'Token has been sent to your email!', isTokenSent: true });
							});
						}
						else {
							console.log(err.message);//TODO Show error message alert here
						}
					});
				}
			}
			else {
				return res.json({ success: false, message: 'User not exists with this email!' });
			}
		});
	});
};