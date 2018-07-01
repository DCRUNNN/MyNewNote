var express = require('express');
var router = express.Router();

var { sequelize } = require("../config/db");

var User = sequelize.import("../models/user");
var Notebook = sequelize.import('../models/notebook');
var Page = sequelize.import('../models/page');


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
//
router.get('/', function (request, response,next) {
    if (request.body.username == undefined ||request.body.username == '') {
        response.render('404',{message:'请输入用户名和密码'});
        return;
    }
});

router.get('/index', function (request, response,next) {

    if (request.body.username == undefined ||request.body.username == '') {
        response.render('404',{message:'请输入用户名和密码'});
        response.redirect('/')
        return;
    }

    User.findOne({
        where:{
            username:username
        }
    }).then(function(message){
        console.log(JSON.stringify(message))
    });


    var user = {username: request.body.username};

    var note=[{title:'大学'},{title:'阅读'},{title:'生活'}];

    response.render('index', { title: 'My Note', user: user,note:note });
});


router.get('/showSection/:notebookID', function (request, response,next) {

    var notebookID = request.params.notebookID;

    Section.findAll({
        where:{
            notebookID:notebookID
        }
    }).then(function(message){
        var sectionResult = JSON.stringify(message);

        console.log(sectionResult)
        response.render('notebook', { title: 'My Note', user:request.cookies.user,note:request.cookies.notebook,section:JSON.parse(sectionResult)});

    });
});

// router.route('/login')
//     .get(function (req,res,next) {
//     res.render('login', {title: '用户登录界面a a'});
// })
//     .post(function (request, response,next) {
//         var user = {
//             username: 'DC',
//             password:'admin'
//         };
//         console.log("======");
//
//         console.log(request.body);
//
//         console.log("======");
//
//         if(request.body.username === user.username && request.body.password === user.password) {
//             response.redirect('/')
//         }
//         response.redirect('/login');
//     });

// router.get('/login',function (req,res,next) {
//     res.render('login', {title: '用户登录界面heihei'});
// })


module.exports = router;

