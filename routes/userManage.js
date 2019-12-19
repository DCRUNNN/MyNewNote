var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

var {sequelize} = require("../config/db");

var User = sequelize.import("../models/user");
var Notebook = sequelize.import('../models/notebook');
var Page = sequelize.import('../models/page');

/* GET users listing. */
router.get('/modifyUser', function (request, response, next) {

  User.update({
    username: request.query.username,
    email: request.query.email,
    phoneNumber: request.query.phoneNumber,
    privilege: request.query.privilege
  }, {
    where: {
      userID: request.query.userID,
    }
  }).then(function (message) {
    // var pageResult = JSON.stringify(message);
    console.log(message);
    var success = message[0] != "0"; //message[0]是影响的行数，为0则修改失败，否则成功
    if (success == true) {
      return response.json({
        message: 'success'
      })
    } else {
      return response.json({
        message: 'error'
      })
    }
  });

});

router.get('/deleteUser', function (request, response, next) {
  console.log(request.query.userID);
  User.destroy({
    where: {
      userID: request.query.userID
    }
  }).then(function (message) {
    // var pageResult = JSON.stringify(message);
    console.log(message);
    var success = message[0] != "0"; //message[0]是影响的行数，为0则修改失败，否则成功
    if (success == true) {
      return response.json({
        message: 'success'
      })
    } else {
      return response.json({
        message: 'error'
      })
    }
  });

});

module.exports = router;
