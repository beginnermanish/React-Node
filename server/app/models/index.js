var sequelize = require('../../config/sequalizeConfig');
var bcrypt = require('bcrypt-nodejs');
var Sequelize = require('sequelize');

var userSchema = sequelize.define('users', {
    UserId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    Email: Sequelize.STRING,
    Password: Sequelize.STRING,
    RoleId: Sequelize.INTEGER
}, {
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,

        instanceMethods: {
            validPassword: function (password) {
                return bcrypt.compareSync(password, this.getDataValue('Password'));
            }
        },
        classMethods: {
            generateHash: function (password) {
                return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            }
        }
    });

var assessRecTimeSchema = sequelize.define('assess_record_time', {
    ID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    Patient_id: Sequelize.INTEGER,
    User_id: Sequelize.INTEGER,
    Start_time: Sequelize.STRING,
    End_time: Sequelize.STRING,
    Score: Sequelize.INTEGER,
    SubmittedOn: Sequelize.STRING
}, { timestamps: false, freezeTableName: true });

var assessDetailSchema = sequelize.define('assess_detail', {
    ID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    time_id: Sequelize.INTEGER,
    Assess_item_id: Sequelize.INTEGER,
    Value: Sequelize.STRING,
    Assess_group_id: Sequelize.INTEGER
}, { timestamps: false, freezeTableName: true });


var patientSchema = sequelize.define('patients', {
    ID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    First_name: Sequelize.STRING,
    Last_name: Sequelize.STRING,
    Uid: Sequelize.INTEGER
}, { timestamps: false, freezeTableName: true });

module.exports = { User: userSchema, AssetRecTime: assessRecTimeSchema, AssetDetail: assessDetailSchema, Patient: patientSchema };
