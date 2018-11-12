/**
 * 用户模块 user.js
 * @authors Carmelo Lcanboom
 */

var express = require('express');
var router = express.Router();

// 处理get请求
router.get('/', function(req, res) {
    res.send({
        'username':'杨幂',
        'sex':'woman',
        'address':'上海'
    });
});

// 处理POST请求
router.post('/',function(req,res){
    console.log('接受到了post请求');
    res.send({
        'regist':{title:req.param('username')}
    })
});

module.exports = router;
