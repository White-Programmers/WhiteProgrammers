const User = require('mongoose').model('User');
const City = require('mongoose').model('City');
const Role = require('mongoose').model('Role');
const encryption = require('./../utilities/encryption');

module.exports = {
    registerGet: (req, res) => {

        City.find({}).then(cities =>{
            res.render('user/register',{cities:cities});
        });
    },

    registerPost:(req, res) => {
        let registerArgs = req.body;
        let cities = [];
        let roles = [];

        User.findOne({email: registerArgs.email}).then(user => {
            let errorMsg = '';
            if (user) {
                errorMsg = 'User with the same username exists!';
            } else if (registerArgs.password !== registerArgs.repeatedPassword) {
                errorMsg = 'Passwords do not match!'
            }

            if (errorMsg) {
                registerArgs.error = errorMsg;
                res.render('user/register', registerArgs)
            } else {
                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword(registerArgs.password, salt);

                let userObject = {
                    email: registerArgs.email,
                    passwordHash: passwordHash,
                    fullName: registerArgs.fullName,
                    salt: salt,
                    city: registerArgs.city,
                    banned: false,
                };

                City.findById(registerArgs.city).then(city =>{
                    Role.findOne({name: 'User'}).then(role => {


                        roles.push(role.id);
                        cities.push(city.id);

                        userObject.cities = cities;
                        userObject.roles = roles;

                    User.create(userObject).then(user => {

                        city.users.push(user);
                        role.users.push(user);

                        city.save(err =>{
                            if(err){
                                registerArgs.error = err.message;
                                res.render('user/register', registerArgs);
                            }
                            else{
                                role.save();
                                req.logIn(user, (err) => {
                                    if (err) {
                                        registerArgs.error = err.message;
                                        res.render('user/register', registerArgs);
                                        return;
                                    }
                                    res.redirect('/');
                                })
                            }
                        });


                    })});
                });
            }
        })
    },

    loginGet: (req, res) => {
        res.render('user/login');
    },

    loginPost: (req, res) => {
        let loginArgs = req.body;
        User.findOne({email: loginArgs.email}).then(user => {
            if (user.banned) {
                let errorMsg = 'User is banned!';
                loginArgs.error = errorMsg;
                res.render('user/login', loginArgs);
                return;
            }
            if (!user ||!user.authenticate(loginArgs.password)) {
                let errorMsg = 'Either username or password is invalid!';
                loginArgs.error = errorMsg;
                res.render('user/login', loginArgs);
                return;
            }

            req.logIn(user, (err) => {
                if (err) {
                    console.log(err);
                    res.redirect('/user/login', {error: err.message});
                    return;
                }

                res.redirect('/');
            })
        })
    },

    logout: (req, res) => {
        req.logOut();
        res.redirect('/');
    }
};
