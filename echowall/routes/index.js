/*
	路由分发控制总入口
*/

var express = require('express');
var router = express.Router();


module.exports = function(app){
    
    var yang = require('../controller/yang');
    app.use('/yang', yang);

    var test = require('../controller/test');
    app.use('/test', test);

    var query = require('../controller/query');
    app.use('/query', query);   

    var user = require('../controller/user');
    app.use('/user', user);

    var comment = require('../controller/comment');
    app.use('/comment', comment);

    var my = require('../controller/my');
    app.use('/my', my); 

    var hot = require('../controller/hot');
    app.use('/hot', hot);      
};
