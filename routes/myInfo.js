var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var { sequelize } = require("../config/db");

var User = sequelize.import("../models/user");
var Notebook = sequelize.import('../models/notebook');
var Page = sequelize.import('../models/page');
var Tag = sequelize.import('../models/tag');
var Friends = sequelize.import('../models/friends');
var SharedPage = sequelize.import('../models/sharedPage');

var page = [];
var currentNotebook = [];
var currentPage = [];

router.get('/modifyUser', function (request, response, next) {
    User.update({
        username:request.query.username,
        email:request.query.email,
        phoneNumber:request.query.phoneNumber,
        password:request.query.password
    }, {
        where: {
            userID: request.cookies.user.userID
        }
    }).then(function (message) {
        // var pageResult = JSON.stringify(message);
        var success = message[0] != "0"; //message[0]是影响的行数，为0则修改失败，否则成功
        if (success == true) {
            User.findOne({
                where:{
                    userID:request.cookies.user.userID
                }
            }).then(function(message2){
                var userResult=JSON.stringify(message2);
                // console.log(notebookResult)
                response.cookie('user', JSON.parse(userResult));
                console.log(userResult)
                response.render('myInfo', { title: 'My Note', user: JSON.parse(userResult), note:request.cookies.notebook });
            });
        } else {
            return  response.json({
                message:'error'
            })
        }
    });
});

router.get('/modifyPassword', function (request, response, next) {
    User.update({
        password:request.query.password
    }, {
        where: {
            userID: request.cookies.user.userID
        }
    }).then(function (message) {
        // var pageResult = JSON.stringify(message);
        var success = message[0] != "0"; //message[0]是影响的行数，为0则修改失败，否则成功
        if (success == true) {
            User.findOne({
                where:{
                    userID:request.cookies.user.userID
                }
            }).then(function(message2){
                var userResult=JSON.stringify(message2);
                // console.log(notebookResult)
                response.cookie('user', JSON.parse(userResult));
                console.log(userResult)
                response.render('myInfo', { title: 'My Note', user: JSON.parse(userResult), note:request.cookies.notebook });
            });
        } else {
            return  response.json({
                message:'error'
            })
        }
    });
});


module.exports = router;

