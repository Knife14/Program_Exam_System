from django.shortcuts import render
from django.http import HttpResponse, response
from django.utils import timezone

from .models import *

import json
import time
import random

# Create your views here.
def index(request):
    print(request.body)

    return HttpResponse('Test the django project!')

'''
url: /examonline/login
use: 检验登录
http: POST 改
content: userID / password
'''
def login(request):
    assert request.method == 'POST'

    # 接口数据处理
    userLogin_json = json.loads(request.body.decode('utf-8'))
    userID = userLogin_json['username']
    password = userLogin_json['password']

    # 查询数据库
    try:
        currentUSER = list(UserInfo.objects.filter(userID=userID).values()).pop()
        response = dict()

        if currentUSER['password'] == password:
            # 登录行为入库，便于后续操作
            UserEvent.objects.create(
                userID=userID,
                eventType='login',
            )

            # 修改user info表对应用户的登录状态
            UserInfo.objects.filter(userID=userID).update(is_online=True)

            # request response
            response['status'] = 'ok'
            response['type'] = 'account'
            response['currentAuthority'] = currentUSER['identify']

            return HttpResponse(json.dumps(response), status=200)
        else:
            return HttpResponse(status=500)
    except:
        return HttpResponse(status=200)

'''
url: examonline/outLogin
use: 退出登录
http: POST
'''
def out_login(request):
    # 数据库记录修正
    last_login = list(UserEvent.objects.filter(eventType='login').values()).pop()
    last_outlogin = list(UserEvent.objects.filter(eventType='login').values()).pop()

    return HttpResponse(status=200)


'''
url: /examonline/currentUser
use: 获取当前用户
http: GET 查
content: 
'''
def current_user(request):
    assert request.method == 'GET'
    response = dict()

    # 登录事件检索
    event_login = list(UserEvent.objects.filter(eventType='login').values()).pop()
    
    userID = event_login['userID']

    # 判断是否是登录态
    # 若是
    nlogin_user = list(UserInfo.objects.filter(userID=userID).values()).pop()
    if nlogin_user['is_online']:
        response['success'] = True
        response['data'] = dict()
        if nlogin_user['identify'] == 'student':
            response['data']['name'] = nlogin_user['name']
            response['data']['userid'] = nlogin_user['userID']
            response['data']['email'] = nlogin_user['email']
            response['data']['college'] = nlogin_user['college']
            response['data']['major'] = nlogin_user['major']
            response['data']['phone'] = nlogin_user['telephone']
            response['data']['access'] = nlogin_user['identify']

        return HttpResponse(json.dumps(response), status=200)

    response['isLogin'] = False
    return HttpResponse(json.dumps(response), status=401)

'''
url: /examonline/addUser
use: 用于管理者增加各种身份的不同用户
http: put 增
content: identify / userID / password / name / college / major
'''
def add_user(request):
    assert request.method == 'PUT'
    userInfo_json = json.loads(request.body.decode('utf-8'))

    # 根据身份分类处理
    identify = userInfo_json['identify']
    userID = userInfo_json['userID']

    # 若添加的userID重复
    if UserInfo.objects.filter(userID=userID):
        return HttpResponse(status=500)

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

    return HttpResponse(status=200)

'''
url: /examonline/changeUser
use: 用于管理者修改各种不同用户
http: post 改
content: userID / identify / password / name / college / major
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

    return HttpResponse(status=200)


'''
url: /examonline/changeMyself
use: 用于用户本人修改个人信息
http: post 改
content: userID / password / telephone / email
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

    return HttpResponse(status=200)

'''
url: /examonline/getMessage
use: 用于展示个人信息
http: get 查
content: userID / identify
'''
def get_message(request):
    assert request.method == 'GET'
    
    userInfo_json = json.loads(request.body.decode('utf-8'))
    userID = userInfo_json['userID']
    identify = userInfo_json['identify']

    # 数据库查询
    currUser = list(UserInfo.objects.filter(identify=identify, userID=userID).values()).pop()

    # 反馈
    response = dict()
    response['userID'] = currUser['userID']
    response['password'] = currUser['password']
    response['name'] = currUser['name']
    response['college'] = currUser['college']
    response['telephone'] = currUser['telephone']
    response['email'] = currUser['email']
    if identify == 'student':
        response['major'] = currUser['major']

    return HttpResponse(json.dumps(response), content_type='application/json', status=200)

'''
url: /examonline/addProblem
use: 用于添加题目以及测试用例
http: put
content: tqType / name / tags / content / answer / limitTime / example / creator
'''
def add_problem(request):
    assert request.method == 'PUT'
    problem_json = json.loads(request.body.decode('utf-8'))

    # 处理数据
    tqType = problem_json['tqType']
    tqID = \
        str(timezone.now().year) + str(timezone.now().month).rjust(2, '0') + str(timezone.now().day).rjust(2, '0') \
            + str(timezone.now().hour + 8).rjust(2, '0') + str(timezone.now().minute).rjust(2, '0') \
                + str(random.randint(0, 100)).rjust(2, '0') \
                    + ('1' if tqType == '填空' else '2')
    creator = problem_json['creator']  # 试题创建者ID
    name = problem_json['name']
    
    tags = list()
    for tag in json.loads(problem_json['tags']):
        tags.append(tag)

    content = problem_json['content']
    
    if tqType == '填空':
        answer = problem_json['answer']

        TestQuestions.objects.create(
            tqID=tqID,
            tqType=tqType,
            name=name,
            tags=str(tags),
            content=content,
            answer=answer,
            creator=creator,
        )

    elif tqType == '编码':
        limitTime = problem_json['limitTime']

        # 示例处理
        # 前端将所有输入、输出示例的分别存放在两个数组中
        # 一个输入、输出示例即为对应数组的一个元素
        for index in range(len(problem_json['cInput'])):
            cInput = problem_json['cInput'][index]
            cOutput = problem_json['cOutput'][index]
            
            AnswerExamples.objects.create(
                tqID=tqID,
                cInput=cInput,
                cOutput=cOutput,
                creator=creator,
            )

        # 测试用例处理
        # 前端将所有测试用例存放到同一数组中，一个测试用例即为对应数组的一个元素
        for te in problem_json['TEs']:
            TestExamples.objects.create(
                tqID=tqID,
                content=te,
                creator=creator,
            )

        TestQuestions.objects.create(
            tqID=tqID,
            tqType=tqType,
            name=name,
            tags=tags,
            content=content,
            limitTime=limitTime,
            creator=creator,
        )

    return HttpResponse(status=200)


def add_program(request):
    print(request.body)

    return HttpResponse(status=200)