var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

var {sequelize} = require("../config/db");

var User = sequelize.import("../models/user");
var Notebook = sequelize.import('../models/notebook');
var Page = sequelize.import('../models/page');
var Friends = sequelize.import('../models/friends');
var SharedPage = sequelize.import('../models/sharedPage');

/* GET users listing. */

router.get('/searchUser', function (request, response, next) {
  var username = request.query.username;

  User.findOne({
    attributes: ['userID', 'username', 'email', 'phoneNumber', 'privilege'],
    where: {
      username: username,
    }
  }).then(function (message) {
    var userResult = JSON.stringify(message);
    return response.json({
      message: 'success',
      data: JSON.parse(userResult)
    });

  });

});

router.get('/getPageContent', function (request, response, next) {

  SharedPage.findOne({
    where: {
      sharedID: request.query.sharedID,
    }
  }).then(function (message) {
    var pageResult = JSON.stringify(message);
    return response.json({
      message: 'success',
      data: JSON.parse(pageResult)
    });

  });

});

router.get('/updatePage', function (request, response, next) {

  SharedPage.update({
    content: request.query.content,
    title: request.query.title
  }, {
    where: {
      sharedID: request.query.sharedID,
    }
  }).then(function (message) {
    // var pageResult = JSON.stringify(message);
    var success = message[0] != "0"; //message[0]是影响的行数，为0则修改失败，否则成功
    if (success == true) {
      Page.update({
        content: request.query.content,
        title: request.query.title
      }, {
        where: {
          pageID: request.query.pageID,
        }

      }).then(function (message2) {
        // var pageResult = JSON.stringify(message);
        var success = message2[0] != "0"; //message[0]是影响的行数，为0则修改失败，否则成功
        if (success == true) {
          return response.json({
            message: 'success'
          })
        } else {
          return response.json({
            message: 'error'
          })
        }
      })
    } else {
      return response.json({
        message: 'error'
      })
    }
    // response.cookie('pageMenu', JSON.parse(pageResult));
    // // response.render('index', { title: 'My Note', user: request.cookies.user, note:JSON.parse(notebookResult),pageMenu:request.cookies.pageMenu,pageContent:request.cookies.pageContent });
    // return response.json({
    //     message: 'success'
    // })
  });

});

router.get('/deletePage', function (request, response, next) {
  SharedPage.destroy({
    where: {
      sharedID: request.query.sharedID,
    }
  }).then(function (msg) {
    return response.json({
      message: 'success'
    })
  });

});

router.get('/modifyPrivilege', function (request, response, next) {

  SharedPage.update({
    privilege: request.query.privilege
  }, {
    where: {
      sharedID: request.query.sharedID,
    }
  }).then(function (message) {
    // var pageResult = JSON.stringify(message);
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
    // response.cookie('pageMenu', JSON.parse(pageResult));
    // // response.render('index', { title: 'My Note', user: request.cookies.user, note:JSON.parse(notebookResult),pageMenu:request.cookies.pageMenu,pageContent:request.cookies.pageContent });
    // return response.json({
    //     message: 'success'
    // })
  });

});

router.get('/addThumbsUp', function (request, response, next) {

  SharedPage.findOne({
    where: {
      sharedID: request.query.sharedID,
    }
  }).then(function (message) {
    var pageResult = JSON.stringify(message);
    var result = JSON.parse(pageResult);
    if (result.thumbs == 1) {
      return response.json({
        message: 'error',
        data: "您已经点过赞啦！"
      });
    } else {
      SharedPage.update({
        thumbs: 1
      }, {
        where: {
          sharedID: request.query.sharedID,
        }
      }).then(function (message) {
        // var pageResult = JSON.stringify(message);
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
        // response.cookie('pageMenu', JSON.parse(pageResult));
        // // response.render('index', { title: 'My Note', user: request.cookies.user, note:JSON.parse(notebookResult),pageMenu:request.cookies.pageMenu,pageContent:request.cookies.pageContent });
        // return response.json({
        //     message: 'success'
        // })
      });

    }

  });

});

module.exports = router;
