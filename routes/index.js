var express = require('express');
var router = express.Router();
var controller = require('../controller/controller.js');
const passport = require('passport');
var Message = require('../models/message');

/* GET home page. */
router.get('/', function (req, res, next) {
  Message.find()
    .populate('user')
    .then((messages) => {
      res.render('index', { title: 'Express', user: req.user, messages });
    });
});

//signup routes
router.get('/sign-up', controller.getForm);
router.post('/sign-up', controller.postForm);

//GET login
router.get('/log-in', controller.getLogin);
//POST login
router.post('/log-in', controller.postLogin);

//logout
router.get('/log-out', (req, res) => {
  req.logout();
  res.redirect('/');
});

//Get membership password form
router.get('/membership', controller.getMembership);
router.post('/membership', controller.postMembership);

//get post message form
router.get('/message', controller.getMessage);

//handle POST message form
router.post('/message', controller.postMessage);

module.exports = router;
