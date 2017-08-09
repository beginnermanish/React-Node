const express = require('express');
const passport = require('passport');
const router = new express.Router();
var Promise = require('promise');
var connection = require('./../../app/connection');
var { AssetDetail, AssetRecTime, User, Patient } = require('./../../app/models');
var Moment = require('moment');
var sequelize = require('../../config/sequalizeConfig');

var getItemIndex = function (arr, parentName) {
	var toReturn = -1;
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].title == parentName) {
			toReturn = i;
			break;
		}
	}
	return toReturn;
};

var getDrugData = function () {

	return new Promise(function (resolve, reject) {
		var query = 'select * from Drugs';

		connection.query(query, function (err, rows) {
			var Contents = {};
			if (!err) {
				resolve(rows);
			}
			else {
				console.error(err);
				reject();
			}
		});
	});
};

var getPatients = function (params) {
	return new Promise(function (resolve, reject) {
		var query = `SELECT Id, Name, Score, IsCompleted FROM (SELECT Id, CONCAT(First_name, " ", Last_name) AS Name, LastAssess.Score, 
						CASE WHEN LastAssess.Patient_id IS NULL THEN 1 ELSE 0 END AS IsCompleted FROM Patients 
						LEFT OUTER JOIN (SELECT Patient_id, Score FROM assess_record_time WHERE SubmittedOn IS NULL GROUP BY Patient_id) LastAssess ON 
						LastAssess.Patient_id = Patients.Id) PatientList`;
		var whereParams = [];
		var replacements = [];

		if (params.name) {
			whereParams.push("Name LIKE ?");
			params.name = '%' + params.name + '%';
			replacements = [params.name];
		}
		if (params.forHistory === "true") {
			query = `SELECT Id, Name FROM (SELECT CONCAT(First_name, " ", Last_name) AS Name, Id FROM Patients WHERE Id IN (SELECT Patient_id FROM assess_record_time WHERE SubmittedOn IS NOT NULL GROUP BY Patient_id)) Patients`;
		}
		if (whereParams.length > 0) {
			query += ' WHERE ' + whereParams.join(' AND ');
		}

		sequelize.query(query, { replacements: replacements, type: sequelize.QueryTypes.SELECT })
			.then(function (rows) {
				resolve(rows);
			}).catch(function (err) {
				if (err) {
					console.log(err);
				}
				reject();
			});

	});
}

var sortArray = function (array, sortColumnName) {
	array.sort(function (a, b) {
		var x = a[sortColumnName].toLowerCase();
		var y = b[sortColumnName].toLowerCase();
		if (x < y) { return -1; }
		if (x > y) { return 1; }
		return 0;
	});
	return array;
}

var upsert = function (model, values, condition) {
	return model
		.findOne({ where: condition })
		.then(function (obj) {
			if (obj) { // update
				return obj.update(values);
			}
			else { // insert
				return model.create(values);
			}
		});
}

router.get('/assessment/perform_assessment', function (req, res) {
	connection.query("select * from assess_lookup ORDER BY SortOrder, Group_Id", function (err, rows) {
		var finalFormData = [];
		var childItems = {};

		rows.forEach(function (record) {
			var parentName = record.Group_name;
			var groupId = record.Group_ID;
			var child = [];

			var childItem = { text: record.Item, value: record.Score_value, itemId: record.Item_id };
			child.push(childItem);

			var index = getItemIndex(finalFormData, parentName);
			if (index == -1) {
				var info = record.Group_description;
				if (record.Score_value == 0) {
					finalFormData.push({ "groupId": groupId, "title": parentName, "type": "number", "info": info, "itemId": record.Item_id });
				}
				else {
					finalFormData.push({ "groupId": groupId, "title": parentName, "options": child, "info": info, "itemId": record.Item_id });
				}
			}
			else {
				finalFormData[index].options.push(childItem);
			}
		});

		Patient.findById(req.query.PatientId).then(function (patient) {
			if (!patient) { //If Patient not found in database
				return res.json({ success: false, error: 'Invalid Patient.' });
			}
			AssetRecTime.findOne({ where: { SubmittedOn: { $eq: null }, Patient_id: patient.ID }, order: 'End_time DESC' }).then(function (assetRec) {
				if (assetRec) {
					AssetDetail.findAll({ where: { time_id: assetRec.ID } }).then(function (assetDetails) {
						return res.json({ success: true, FormFields: finalFormData, assetDetails: assetDetails, patient: patient, assessRecord: assetRec });
					})
				} else {
					return res.json({ success: true, FormFields: finalFormData, assetDetails: [], patient: patient });
				}
			})
		}, function (error) {
			console.log(error);
		}).catch(function (error) {
			if (err)
				return res.json({ success: false, error: err });
		});
	});
});

router.post('/assessment/perform_assessment', function (req, res) {
	var assessData = req.body.data;
	var assessRecord = req.body.assessRecord;
	var startTime = Moment(assessRecord.Start_time).format("YYYY-MM-DD HH:mm");

	sequelize.query("SELECT COUNT(1) AS RecordCount FROM assess_record_time WHERE User_Id = ? AND Patient_Id = ? AND DATE_FORMAT(Start_time, '%Y-%m-%d %H:%i') = ?\
		AND SubmittedOn IS NOT NULL",
		{ replacements: [assessRecord.User_id, assessRecord.Patient_id, startTime], type: sequelize.QueryTypes.SELECT }
	).then(function (data) {
		if (data && data.length > 0 && data[0].RecordCount > 0) {
			return res.json({ success: true, alreadyExist: true });
		}
		else {
			var assessRec = AssetRecTime.build(assessRecord);
			// save the assess_record_time
			upsert(AssetRecTime, assessRecord, { SubmittedOn: { $eq: null }, Patient_id: { $eq: assessRecord.Patient_id } }).then(function (rec) {
				//delete all Assess detail data as  
				AssetDetail.destroy({ where: { time_id: rec.dataValues.ID } }).then(function () {
					for (var i = 0; i < assessData.length; i++) {
						assessData[i].time_id = rec.dataValues.ID;
					}
					//Save asset details
					AssetDetail.bulkCreate(assessData).then(function () {
						return AssetDetail.findAll({ where: { time_id: rec.dataValues.ID } });
					}).then(function (assesments) {

						return res.json({ success: true });
					});
				}, function (err) {
					if (err)
						return res.json({ success: false, error: err });
				});
			}).catch(function (err) {
				if (err)
					return res.json({ success: false, error: err });
			});
		}
	})
});

router.get('/patientdetail', function (req, res) {
	getPatients(req.query).then(function (rows) {
		res.json({ success: true, PatientData: rows });
	});
});

router.get('/desk_ref/drugs', function (req, res) {

	getDrugData().then(function (rows) {

		var Contents = {};
		var opioid = rows.filter(function (item) {
			return item.IsOpioid == 1;
		});
		var nonopioid = rows.filter(function (item) {
			return item.IsOpioid == 0;
		});

		Contents["Opioids"] = sortArray(opioid, 'Generic_name');
		Contents["Nonopioid"] = sortArray(nonopioid, 'Generic_name');

		res.json({ success: true, Drugs: Contents });


	}, function (err) {
		res.json({ success: false, errorMessage: err });
	});
});

router.get('/desk_ref/signs', function (req, res) {
	connection.query("select * from signs", function (err, rows) {
		res.json({ success: true, Signs: sortArray(rows, 'Name') });
	});
});

router.get('/desk_ref/screening', function (req, res) {
	connection.query("select * from screening", function (err, rows) {
		res.json({ success: true, ScreeningData: sortArray(rows, 'Name') });
	});
});

router.get('/desk_ref/guideline', function (req, res) {
	connection.query("select * from guideline", function (err, rows) {
		res.json({ success: true, GuideLineData: rows });
	});
});

router.get('/desk_ref/nas_info', function (req, res) {
	connection.query("select * from Nas_Info", function (err, rows) {
		res.json({ success: true, NasInfo: rows });
	});
});
router.get('/desk_ref/tools', function (req, res) {
	connection.query("select * from Tools", function (err, rows) {
		res.json({ success: true, Tools: rows });
	});
});

router.get('/desk_ref/non_pharmacological', function (req, res) {
	connection.query("select * from Non_pharm_methods", function (err, rows) {
		res.json({ success: true, NonPharmacoLogical: sortArray(rows, 'Name') });
	});
});
router.get('/desk_ref/pharmacological', function (req, res) {
	connection.query("select * from Pharm_methods", function (err, rows) {
		res.json({ success: true, PharmacoLogical: sortArray(rows, 'Name') });
	});
});

router.get('/desk_ref/faq', function (req, res) {
	connection.query("select * from faq", function (err, rows) {
		var finalFormData = [];

		rows.forEach(function (record) {
			var parentName = record.Category;
			var child = [];

			var childItem = { question: record.Question, answer: record.Answer, reference: record.Reference, Image: record.image, Video: record.video };
			child.push(childItem);

			var index = getItemIndex(finalFormData, parentName);
			if (index == -1) {
				finalFormData.push({ "title": parentName, "options": child });
			}
			else {
				finalFormData[index].options.push(childItem);
			}
		});

		res.json({ success: true, Faq: finalFormData });
	});
});

router.post('/assessments', function (req, res) {
	var patientId = req.body.patientId;
	var startTime = req.body.startTime;
	var endTime = req.body.endTime;
	AssetRecTime.findAll({
		where: {
			Patient_id: patientId,
			Start_time: { $between: [startTime, endTime] },
			SubmittedOn: { $ne: null }
		},
		order: 'Start_time'

	}).then((assesments) => {
		var data = [], assesstRecIds = [];
		for (var i = 0; i < assesments.length; i++) {
			data.push(assesments[i].dataValues);
			assesstRecIds.push(assesments[i].dataValues.ID)
		}

		AssetDetail.findAll({
			where: {
				time_id: {
					$in: assesstRecIds
				}
			}
		}).then((assessDetails) => {
			connection.query("SELECT MIN(Group_name) AS GroupName, Group_ID FROM assess_lookup GROUP BY Group_ID", function (err, groups) {
				Patient.findById(patientId).then(function (patient) {
					return res.json({ success: true, assetRecTime: data, assessDetails: assessDetails, groups: groups, patient: patient });
				});
			});
		})
	});
});

router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;