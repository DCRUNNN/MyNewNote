var express = require('express');
var router = express.Router();

var {sequelize} = require("../config/db");

var User = sequelize.import("../models/user");
var Notebook = sequelize.import('../models/notebook');
var Page = sequelize.import('../models/page');

// var User = require('../models/user');

router.get('/', function (req, res, next) {
  res.render('login', {title: '很高兴遇见你'});
});

router.get('/login', function (req, res, next) {
  res.redirect('/')
})

router.get('/signUp', function (req, res, next) {
  console.log("注册！");
  res.render('signUp', {title: '很高兴遇见你'});

})

router.post('/index', function (request, response, next) {
  const self = this;
  if (request.body.username === undefined || request.body.username === '') {
    response.render('error');
    return;
  }
  let username = request.body.username;
  let password = request.body.password;

  User.findOne({
    where: {
      username: username
    }
  }).then(function (message) {
    let obj = JSON.stringify(message);
    let data = JSON.parse(obj);
    let realPassword = data.password;
    if (realPassword === password) {
      let user = data;

      Notebook.findAll({
        where: {
          userID: data.userID
        }
      }).then(function (message) {
        let notebookResult = JSON.stringify(message);
        response.cookie('user', user);
        response.cookie('notebook', JSON.parse(notebookResult));
        response.render('index', {
          title: 'My Note',
          user: user,
          note: JSON.parse(notebookResult),
          pageMenu: [],
          pageContent: [],
          currentNotebook: {title: '笔记本'}
        });
      });
      return;
    } else {
      response.redirect('/');
    }
  });
});

router.post('/signUp', function (request, response, next) {
  // var username = request.query.username;

  User.findAll({
    where: {
      username: request.body.username
    }
  }).then(function (message) {
    var obj = JSON.stringify(message);
    var data = JSON.parse(obj);
    var check = data[0] == undefined;
    if (check == false) {
      response.render('404', {message: '该用户名已存在！'});
    } else {
      var user = {
        username: request.body.username,
        password: request.body.password,
        email: request.body.email,
        phoneNumber: request.body.phoneNumber,
        privilege: 0
      };

      User.create(user).then(function (msg) {
        response.redirect('/login');
      });
    }
  })

});

module.exports = router;
