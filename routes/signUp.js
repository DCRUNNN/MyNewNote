var express = require('express');
var router = express.Router();

var { sequelize } = require("../config/db");

var User = sequelize.import("../models/user");

// var User = require('../models/user');

router.get('/',function (req,res,next) {
    res.render('signUp', {title: '很高兴遇见你'});
})

router.post('/mySignUp',function (request, response,next) {
    // var username = request.query.username;

    var user = {
        username: request.body.username,
        password: request.body.password,
        email:request.body.email,
        phoneNumber:request.body.phoneNumber,
        privilege:0
    };

    User.create(user).then(function(msg){
        // console.log(msg);
        // var note=[{title:'大学'},{title:'阅读'},{title:'生活'}];
        // response.render('index', { title: 'My Note', user: user,note:note });
        response.redirect('/login');
        return
    });
});

module.exports = router;
