# -*- encoding: UTF-8 -*-
import redis
import time
import datetime

'''
每隔两周清空 redis 中的浏览量统计
'''

pool = redis.ConnectionPool(host='localhost',port=6379,db=0,password='redisPassword')
client = redis.StrictRedis(connection_pool=pool)

def clear_redis(client, name):
	result = client.delete(name)
	time = datetime.datetime.now().date()
	if result:
		print('clear on' + time + '\n')
	else
		print('clear error on' + time + '\n')

def main():
	clear_redis(client, "view_last_twoWeek")

main()