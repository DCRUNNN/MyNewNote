var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var { sequelize } = require("../config/db");

var User = sequelize.import("../models/user");
var Notebook = sequelize.import('../models/notebook');
var Page = sequelize.import('../models/page');
var Friends = sequelize.import('../models/friends');

/* GET users listing. */

router.get('/searchUser', function(request, response, next) {
    var username = request.query.username;

    User.findOne({
        attributes: ['userID', 'username','email','phoneNumber','privilege'],
        where:{
            username:username,
        }
    }).then(function(message){
        var userResult=JSON.stringify(message);
        return response.json({
            message: 'success',
            data: JSON.parse(userResult)
        });

    });

});

router.get('/addFriend', function(request, response, next) {
    var username = request.query.username;
    var friendUserID = request.query.userID;
    var email = request.query.email;
    var phoneNumber = request.query.phoneNumber;

    var friend = {
        userID: request.cookies.user.userID,
        friendID: friendUserID,
        friendUsername: username,
        friendEmail:email,
        friendPhoneNumber:phoneNumber
    };

    var friend2 = {
        userID: friendUserID,
        friendID: request.cookies.user.userID,
        friendUsername: request.cookies.user.username,
        friendEmail: request.cookies.user.email,
        friendPhoneNumber: request.cookies.user.phoneNumber
    };

    Friends.bulkCreate([friend,friend2]).then(function (msg) {
        Friends.findAll({
            where: {
                userID: request.cookies.user.userID
            }
        }).then(function (message) {
            var friendsResult = JSON.stringify(message);
            response.cookie('friends', JSON.parse(friendsResult));
            // response.render('friends', {
            //     title: 'My Note',
            //     user: request.cookies.user,
            //     note: request.cookies.notebook,
            //     allFriends: JSON.parse(friendsResult)
            // });
            return response.json({
                message:'success'
            })
        });
    });


    });

router.get('/deleteFriend', function(request, response, next) {
    var userID = request.query.userID;
    var friendID = request.query.friendID;

    Friends.destroy({
        where: {
            userID: userID,
            friendID:friendID
        }
    }).then(function (message) {
        // var pageResult = JSON.stringify(message);
        var success = message[0] != "0"; //message[0]是影响的行数，为0则修改失败，否则成功
        if (success == true) {
            // return  response.json({
            //     message:'success',
            // })
            Friends.destroy({
                where:{
                    userID: friendID,
                    friendID:userID
                }
            }).then(function(msg){
                Friends.findAll({
                    where: {
                        userID: request.cookies.user.userID
                    }
                }).then(function (message) {
                    var friendsResult = JSON.stringify(message);
                    response.cookie('friends', JSON.parse(friendsResult));
                    // response.render('friends', {
                    //     title: 'My Note',
                    //     user: request.cookies.user,
                    //     note: request.cookies.notebook,
                    //     allFriends: JSON.parse(friendsResult)
                    // });
                    return response.json({
                        message:'success'
                    })
                });
            });
        } else {
            return  response.json({
                message:'error'
            })
        }
    });


});


module.exports = router;
