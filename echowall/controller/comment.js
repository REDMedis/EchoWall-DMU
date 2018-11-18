/**
 * 评论模块 comment.js
 * @authors Carmelo Lcanboom
 */

var express = require('express');
var router = express.Router();
//var database = require('./function/dbconnection');
var database = require('./function/dbPoolConnection');
var wechatCommunicate = require('./function/wechatCommunicate');
var userCommon = require('./function/userCommon');
var param;
var sqlArray = [];
var per_page_count = 10;
var page;
var start;
var sql;

/*
* 添加评论
*/
router.post('/add',function(req, res, next){
	var userId = req.body.userid;
	console.log(userId);
	var openid = req.body.openid;
	var sk = req.body.sk;
	var echoid = req.body.echoid;
	var content = req.body.content;
	var time = req.body.time;
	// 事务组成
	var sql_add_comment = "insert INTO comment set ?";
	param = {
				'userId': userId, 
				'echoId': echoid,
				'content': content,
				'time': time
			};
	sqlArray.push(database.getSqlParamEntity(sql_add_comment, param));
					
	var sql_add_userAction = "insert INTO userAction set ?";
	param = {
				'userId': userId, 
				'echoId': echoid,
				'actionType': 'commit',
				'time': time
			};
	sqlArray.push(database.getSqlParamEntity(sql_add_userAction, param));
					
	var	sql_add_echoCommentCount = "update echowall set commentCount = commentCount + 1 where ?";
	param = { 'id': echoid };
	sqlArray.push(database.getSqlParamEntity(sql_add_echoCommentCount, param));

	userCommon.userTransaction(sk, openid, sqlArray).then((result) => {
		if (result) 
			res.json(result);
	}, (error) => {
		res.json(error);
	});

	sqlArray = [];		// 情空事务数组
})

router.post('/like',function(req, res, next){
	var userId = req.body.userid;
	var openid = req.body.openid;
	var sk = req.body.sk;
	var commentid = req.body.commentid;
	var flag = req.body.flag;
	var time = req.body.time;
	var	sql_Commentlike;
	var actionType;

	if (flag) {
		actionType = 'like_do';
		sql_Commentlike = "update comment set likeNum = likeNum + 1 where ?";						
	}
	else{
			actionType = 'like_undo';						
			sql_Commentlike = "update comment set likeNum = likeNum - 1 where ?";												
	}

	var sql_add_userAction = "insert INTO userAction set ?";
	param = {
				'userId': userId, 
				'commentId': commentid,
				'actionType': actionType,
				'time': time
			};
	sqlArray.push(database.getSqlParamEntity(sql_add_userAction, param));
										
	param = { 'id': commentid };
	sqlArray.push(database.getSqlParamEntity(sql_Commentlike, param));

	userCommon.userTransaction(sk, openid, sqlArray).then((result) => {
		if (result) 
			res.json(result);
	}, (error) => {
		res.json(error);
	});

	sqlArray = [];		// 情空事务数组
})

router.post('/dislike',function(req, res, next){
	var userId = req.body.userid;
	var openid = req.body.openid;
	var sk = req.body.sk;
	var commentid = req.body.commentid;
	var time = req.body.time;

	var sql_dislike_userAction = "insert INTO userAction set ?";
	param = {
				'userId': userId, 
				'commentId': commentid,
				'actionType': 'dislike',
				'time': time
			};
	sqlArray.push(database.getSqlParamEntity(sql_dislike_userAction, param));
					
	var	sql_commentDislike = "update comment set dislikeNum = dislikeNum + 1 where ?";
	param = { 'id': commentid };
	sqlArray.push(database.getSqlParamEntity(sql_commentDislike, param));

	userCommon.userTransaction(sk, openid, sqlArray).then((result) => {
		if (result) 
			res.json(result);
	}, (error) => {
		res.json(error);
	});

	sqlArray = [];		// 情空事务数组
})

/*
* 获取某 id 的回音壁信息的评论列表
*/
router.get('/list',function(req, res, next){
	var connection = database.connection();
	var echoId = req.query.echoid;
	page = req.query.page;
	start = (page - 1) * per_page_count;
	sql = "SELECT comment.id comment_id, NickName comment_username, avatarUrl comment_userAvatarUrl, content, likeNum, dislikeNum, date_format(time, '%Y-%m-%d %H:%i:%s') time FROM comment, userInfo " 
		+  "where echoId = ? AND userInfo.id = comment.userId " + "ORDER BY time DESC limit " + start + ", " + per_page_count;
	database.query(connection, echoId, sql).then((data) => {
		if (data)
			res.jsonp(data);
		else
			res.jsonp({
		    	'status': "500",
		    	'message':"query error",
			})
	}, (err) => {
			res.jsonp(err);	
	});
})

module.exports = router;