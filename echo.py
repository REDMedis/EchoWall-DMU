#!/usr/bin/env python3
# encoding: utf-8
# 用来抓取回音壁内容并保存到数据库的脚本
# 2018/9/24
# version 1.0.0
# by keith

import urllib
import urllib.request
import re
import time, timeit
import os
import pymysql

# 计时器函数
def clock(func):
	def clocked(*args):
		t0 = timeit.default_timer()
		result = func(*args)
		elapsed = timeit.default_timer() - t0
		name = func.__name__
		arg_str = ', '.join(repr(arg) for arg in args)
		print('[%0.8fs] %s(%s) -> %r' % (elapsed, name, arg_str, result))
		return result
	return clocked

# 伪装报头
user_agent = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36"
headers = {'User-Agent':user_agent}
# 正则表达式定义
title = "主题</th><td>(.*?)<"
letterBox = 'id="letterBoxName">(.*?)<'
problems = '意见或建议(.*?)(\W.*)<th>回复信息'
content = '回复信息(.*?)(\W.*)</p>'
blank = '(<.*?>)|&nbsp;'

@clock
def function(page_start, page_end):
	flag = 0
	title_list = []
	letterBox_list = []
	problem_list = []
	content_list = []
	# 连接数据库
	db = pymysql.connect('localhost', 'root', 'Ln/y&aF37vBnmdt4', 'echo')
	# 创建游标
	cursor = db.cursor()
	for num in range(page_start, page_end):
		# 网页内容抓取
		url = "http://oa.dlmu.edu.cn/echoWall/listEchoWall.do?page=" + str(num) + "&num=&moduleId=&title=&beginTime=&endTime=&letterBoxId=&moduleId="
		request = urllib.request.Request(url, headers = headers)
		response = urllib.request.urlopen(request)
		src = response.read()
		# 使用转义字符来处理匹配中的括号,正则提取 URL 中的标识码
		res_list = re.findall('detail\((\d.*?)\)"', src.decode('utf-8'), re.S)
		# 通过标识码访问 url 并循环 list 内容以及索引
		for index, val in enumerate(res_list):
			res_url = "http://oa.dlmu.edu.cn/echoWall/detailLetter.do?pkId=" + val + "&moduleId=&back=3&hidden=1"
			request = urllib.request.Request(res_url, headers = headers)
			response = urllib.request.urlopen(request)
			src = response.read()
			# 去除空白
			src_require = re.sub('\s', '', src.decode('utf-8'))
			# 匹配标题
			title_list.append(re.search(title, src_require, re.S).group(1))
			# 匹配信箱
			letterBox_list.append(re.search(letterBox, src_require, re.S).group(1))
			# 匹配问题内容
			temp = re.search(problems, src_require, re.S).group(2)
			problem_list.append(re.sub(blank, '', temp))
			# 匹配回复内容
			temp = re.search(content, src_require, re.S).group(2)
			temp = re.sub(blank, '', temp)
			# 切除末尾的时间
			reply = temp[:-15]
			content_list.append(reply)
			# 构造时间
			temp = temp[-15:]
			time = temp[:-5] + ' ' + temp[-5:]
			# 构造数据数组索引值
			e_index = (num - 1) * 10 + index
			# 构造 sql 语句
			sql = "INSERT INTO echowall VALUES\
					('%s', '%s', '%s', '%s', '%s', '%s');" % \
					(val, title_list[e_index], letterBox_list[e_index], problem_list[e_index], content_list[e_index], time)
			try:
				cursor.execute(sql)
				db.commit()
				flag += 1
			except:
				db.rollback()

	db.close()
	return flag

number = function(1, 851)
print('爬取数量:', number)









