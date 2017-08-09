var config = require('./auth.json');
const jwt = require('jsonwebtoken');

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var { User } = require('../app/models');

var connection = require('../app/connection.js');

// expose this function to our app using module.exports
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.UserId);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findOne({ where: { 'UserId': id } }).then(function (user) {
            done(null, user);
            //connection.query("select * from users where userid = " + id, function (err, rows) {});
        }).catch(function (err) {
            if (err)
                return done(err);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        session: false,
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) {

            process.nextTick(function () {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({ where: { 'Email': email } }).then(function (user) {

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        // if there is no user with that email
                        // create the user
                        var newUser = User.build({ Email: email, Password: User.generateHash(password) });

                        // save the user
                        newUser.save(newUser).then(function (user) {
                            return done(null, user.dataValues);
                        }).catch(function (err) {
                            if (err)
                                return done(err);
                        });
                    }

                });

            });

        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        session: false,
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ where: { 'Email': email, 'IsDeleted': 0 } }).then(function (user) {
                if (!user)
                    return done(null, false, 'IncorrectCredentialsError');

                if (!user.validPassword(password)) {
                    return done(null, false, 'IncorrectCredentialsError');
                }

                const payload = {
                    sub: user.dataValues.UserId
                };

                // create a token string
                const token = jwt.sign(payload, config.jwtSecret);
                const data = user.dataValues;

                return done(null, data, token);
                //return done(null, user.dataValues);
            }).catch(function (err) {
                if (err)
                    return done(err);
            });
        }));
};
