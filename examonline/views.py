from django.shortcuts import render
from django.http import HttpResponse
from django.utils import timezone

from .models import *

import json
import time

# Create your views here.
def index(request):

    return HttpResponse('Test the django project!')

'''
url: /examonline/addUser
use: 用于管理者增加各种身份的不同用户
'''
def add_user(request):
    assert request.method == 'POST'
    userInfo_json = json.loads(request.body.decode('utf-8'))

    # 根据身份分类处理
    identify = userInfo_json['identify']
    userID = userInfo_json['userID']
    password = userInfo_json['password']
    name = userInfo_json['name']
    # 如果是管理者身份
    if identify == 'admin':
        # 直接存入数据库
        new_user = UserInfo(
            identify=identify,
            userID=userID,
            password=password,
            name=name,
            changetime=timezone.now(),
        )
        new_user.save()
    elif identify == 'teacher':
        college = userInfo_json['college']
        
        # 存入数据库
        new_user = UserInfo(
            identify=identify,
            userID=userID,
            password=password,
            name=name,
            college=college,
            changetime=timezone.now(),
        )
        new_user.save()
    elif identify == 'student':
        college = userInfo_json['college']
        major = userInfo_json['major']

        # 存入数据库
        new_user = UserInfo(
            identify=identify,
            userID=userID,
            password=password,
            name=name,
            college=college,
            major=major,
            changetime=timezone.now(),
        )
        new_user.save()

    return HttpResponse('added user successfully!')

'''
url: /examonline/changeUser
use: 用于管理者修改各种不同用户
'''
def change_user(request):
    assert request.method == 'POST'
    userInfo_json = json.loads(request.body.decode('utf-8'))

    # 查询用户记录
    userID = userInfo_json['userID']
    currUser = UserInfo.objects.filter(userID=userID)

    identify = userInfo_json['identify']
    password = userInfo_json['password']
    name = userInfo_json['name']
    if identify == 'teacher':
        college = userInfo_json['college']
        
        # 数据库更新
        currUser.update(
            identify=identify,
            password=password,
            name=name,
            college=college,
            changetime=timezone.now(),
        )
    elif identify == 'student':
        college = userInfo_json['college']
        major = userInfo_json['major']
        
        # 数据库更新
        currUser.update(
            identify=identify,
            password=password,
            name=name,
            college=college,
            major=major,
            changetime=timezone.now(),
        )

    return HttpResponse('changed user info successfully!')


'''
url: /examonline/changeMyself
use: 用于用户本人修改个人信息
'''
def change_myself(request):
    assert request.method == 'POST'
    userInfo_json = json.loads(request.body.decode('utf-8'))

    # 查询用户记录
    userID = userInfo_json['userID']
    currUser = UserInfo.objects.filter(userID=userID)

    password = userInfo_json['password']
    telephone = userInfo_json['telephone']
    email = userInfo_json['email']

    # 数据库更新
    currUser.update(
        password=password,
        telephone=telephone,
        email=email,
        changetime=timezone.now(),
    )

    return HttpResponse('changed myself info successfully!')