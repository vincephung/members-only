var User = require('../models/user');
var Message = require('../models/message');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const moment = require('moment');
require('dotenv').config();

//get signup form
exports.getForm = function (req, res) {
  res.render('sign-up-form');
};

//POST signup form
exports.postForm = [
  //validate form inputs
  body('firstName')
    .isAlpha()
    .withMessage('First name can only contain letters')
    .trim()
    .escape()
    .custom((value) => !/\s/.test(value))
    .withMessage('No spaces are allowed in the name'),
  body('lastName')
    .isAlpha()
    .withMessage('Last name can only contain letters')
    .trim()
    .escape()
    .custom((value) => !/\s/.test(value))
    .withMessage('No spaces are allowed in the name'),
  body('username')
    .isEmail()
    .withMessage('Username must be an email')
    .trim()
    .escape()
    .custom((value) => !/\s/.test(value))
    .withMessage('No spaces are allowed in the username'),
  body('password')
    .custom((value) => !/\s/.test(value))
    .withMessage('No spaces are allowed in the password')
    .custom((value, { req }) => value === req.body.passwordConfirm)
    .withMessage('Passwords must match'),

  //process request after validation and sanitzation
  (req, res, next) => {
    //get errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //if there are errors, rerender the form with error messages

      res.render('sign-up-form', {
        userInfo: req.body,
        errors: errors.array(),
      });
    } else {
      //if form info is valid
      //create new instance of user
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        var user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          password: hashedPassword,
          isAdmin: false,
          isMember: false,
        });
        user.save(function (err) {
          if (err) {
            return next(err);
          }
          console.log('New User' + user);
          res.redirect('/'); //redirect back to homepage
        });
      });
    }
  },
];

//get membership page
exports.getMembership = function (req, res) {
  res.render('membership-form');
};
//post membership, if user enters password correctly they become a member
exports.postMembership = function (req, res, next) {
  if (req.body.secretPassword === process.env.MEMBERSHIP) {
    const updatedUser = {
      isMember: true,
    };
    User.findByIdAndUpdate(req.user.id, updatedUser).then((updated) => {
      res.redirect('/');
    });
  } else {
    var err = 'Entered wrong password';
    res.render('membership-form', { errors: [err] });
  }
};

//GET login page
exports.getLogin = function (req, res) {
  res.render('login-form');
};

//POST login page
exports.postLogin = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/log-in',
});

//GET post message page
exports.getMessage = function (req, res) {
  res.render('message-form');
};

//Handle post message page
exports.postMessage = function (req, res) {
  const { title, text } = req.body;
  const newMessage = new Message({
    title,
    text,
    timeStamp: moment().format('MMMM Do YYYY [at] HH:mm:ss'),
    user: req.user.id,
  });
  newMessage.save().then((message) => {
    res.redirect('/');
  });
};
