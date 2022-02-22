from datetime import datetime
from time import strptime
from typing import Collection
from django.core.signing import dumps
from django.shortcuts import render
from django.http import HttpResponse, response
from django.utils import timezone

# 引入token
from .tokenevents import *
import hashlib  # md5 哈希算法加密 无法破解

# 引入数据库模型
from .models import *

# python 标准库
import json
import random
import os
import subprocess  # 创建新进程，专门用于编译执行代码文件

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

        if currentUSER['password'] == password and not currentUSER['is_online']:  # 
            # 创建token
            currentUSER_token = create_token(userID)

            # 修改user info表对应用户的登录状态
            UserInfo.objects.filter(userID=userID).update(is_online=True)

            # request response
            response['status'] = 'ok'
            response['type'] = 'account'
            response['currentAuthority'] = currentUSER['identify']
            response['token'] = currentUSER_token

            return HttpResponse(json.dumps(response), status=200)
        else:
            return HttpResponse(status=500)
    except:
        return HttpResponse(status=404)

'''
url: /examonline/currentUser
use: 获取当前用户
http: GET 查
content: 
'''
def current_user(request):
    assert request.method == 'GET'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    if userID and UserInfo.objects.get(userID=userID).is_online:
        response['success'] = True
        response['data'] = dict()

        currentUser = list(UserInfo.objects.filter(userID=userID).values()).pop()
        # 身份区别
        if currentUser['identify'] == 'student':
            response['data']['name'] = currentUser['name']
            response['data']['userid'] = currentUser['userID']
            response['data']['email'] = currentUser['email']
            response['data']['college'] = currentUser['college']
            response['data']['major'] = currentUser['major']
            response['data']['phone'] = currentUser['telephone']
            response['data']['access'] = currentUser['identify']
        elif currentUser['identify'] == 'teacher':
            response['data']['name'] = currentUser['name']
            response['data']['userid'] = currentUser['userID']
            response['data']['email'] = currentUser['email']
            response['data']['college'] = currentUser['college']
            response['data']['phone'] = currentUser['telephone']
            response['data']['access'] = currentUser['identify']
        elif currentUser['identify'] == 'admin':
            response['data']['name'] = currentUser['name']
            response['data']['userid'] = currentUser['userID']
            response['data']['email'] = currentUser['email']
            response['data']['phone'] = currentUser['telephone']
            response['data']['access'] = currentUser['identify']
        
        return HttpResponse(json.dumps(response), status=200)

    response['isLogin'] = False
    return HttpResponse(json.dumps(response), status=401)

'''
url: examonline/outLogin
use: 退出当前用户
http: POST
'''
def out_login(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    # 修改user info表对应用户的登录状态 
    UserInfo.objects.filter(userID=userID).update(is_online=False)

    response['data'] = dict()
    response['success'] = True

    return HttpResponse(json.dumps(response), status=200)

'''
url: /examonline/changeMyself
use: 用于用户本人修改个人信息
http: post 改
content: telephone / email
'''
def change_myself(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    # 处理 request body
    userInfo_json = json.loads(request.body.decode('utf-8'))
    telephone = userInfo_json['phone']
    email = userInfo_json['email']

    # 查询用户记录，并且进行信息更新
    currUser = UserInfo.objects.filter(userID=userID)
    currUser.update(
        telephone=telephone,
        email=email,
        changetime=timezone.now(),
    )

    # 返回
    response['status'] = 'ok'
    return HttpResponse(json.dumps(response), status=200)

'''
url: /examonline/getUsers
use: 展示所有用户
http: GET 查
'''
def get_users(request):
    assert request.method == 'GET'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    if list(UserInfo.objects.filter(userID=userID).values('identify')).pop()['identify'] == 'admin':
        all_users = list(UserInfo.objects.filter().values())

        # 数据库日期类型不可被json转换
        response['data'] = list()
        for user in all_users:
            tmp = dict()

            tmp['name'] = user['name']
            tmp['identify'] = user['identify']
            tmp['userid'] = user['userID']
            tmp['college'] = user['college']
            tmp['major'] = user['major']

            response['data'].append(tmp)
        
        response['success'] = True
        return HttpResponse(json.dumps(response), status=200)
    
    response['success'] = False
    return HttpResponse(json.dumps(response), status=500)

'''
url: /examonline/addUser
use: 用于管理者增加各种身份的不同用户
http: put 增
content: identify / userID / password / name / college / major
'''
def add_user(request):
    assert request.method == 'PUT'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    admin_ID = get_username(request_token)

    try:
        if UserInfo.objects.get(userID=admin_ID).identify == 'admin':
            print('in')
            # 处理 request body
            userInfo_json = json.loads(request.body.decode('utf-8'))
            # 根据身份分类处理
            identify = userInfo_json['identify']
            userID = userInfo_json['userID']

            # 若添加的userID重复
            if UserInfo.objects.filter(userID=userID):
                response['status'] = 'error'
                return HttpResponse(json.dumps(response), status=500)

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
                ex_college = userInfo_json['college']
                if ex_college == 'computer':
                    college = '计算机学院'
                elif ex_college == 'software':
                    college = '软件学院'
                else:
                    college = '其他学院'
                
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
                ex_college = userInfo_json['college']
                if ex_college == 'computer':
                    college = '计算机学院'
                elif ex_college == 'software':
                    college = '软件学院'
                else:
                    college = '其他学院'
                
                ex_major = userInfo_json['major']
                if ex_major == 'csplus':
                    major = '计算机科学与技术（卓越班）'
                elif ex_major == 'cs':
                    major = '计算机科学与技术'
                elif ex_major == 'iot':
                    major = '物联网工程'
                elif ex_major == 'is':
                    major = '信息安全'
                else:
                    major = '其他专业'

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
            
            response['status'] = 'ok'
            return HttpResponse(json.dumps(response), status=200)
    except:
        response['status'] = 'error'
        return HttpResponse(json.dumps(response), status=500)


'''
url: /examonline/gettheUser
use: 用于向管理者展示当前用户的所有信息
http: POST 查
content: userID
'''
def get_theUser(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    admin_ID = get_username(request_token)

    if UserInfo.objects.get(userID=admin_ID).identify == 'admin':
        userID = request.body.decode('utf-8')
        theUser = UserInfo.objects.get(userID=userID)
        
        response['success'] = True
        response['data'] = dict()

        response['data']['name'] = theUser.name
        response['data']['userid'] = theUser.userID
        response['data']['identify'] = '管理员'
        response['data']['email'] = theUser.email
        response['data']['phone'] = theUser.telephone
        response['data']['password'] = theUser.password
        response['data']['access'] = 'admin'
        if theUser.identify == 'student':
            response['data']['college'] = theUser.college
            response['data']['major'] = theUser.major
            response['data']['identify'] = '学生'
            response['data']['access'] = 'student'
        elif theUser.identify == 'teacher':
            response['data']['college'] = theUser.college
            response['data']['identify'] = '教师'
            response['data']['access'] = 'teacher'

        return HttpResponse(json.dumps(response), status=200)

    response['isLogin'] = False
    return HttpResponse(json.dumps(response), status=500)

'''
url: /examonline/changeUser
use: 用于管理者修改各种不同用户
http: post 改
content: userID / identify / password / name / college / major
'''
def change_user(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    admin_ID = get_username(request_token)

    try:
        if UserInfo.objects.get(userID=admin_ID).identify == 'admin':
            userInfo_json = json.loads(request.body.decode('utf-8'))
            # 查询用户记录
            userID = userInfo_json['userID']
            currUser = UserInfo.objects.filter(userID=userID)

            for info_k, info_v in userInfo_json.items():
                if info_k == 'userID':
                    pass
                elif info_k == 'password':
                    currUser.update(password=info_v, changetime=timezone.now())
                elif info_k == 'college':
                    if info_v == 'computer':
                        college = '计算机学院'
                    elif info_v == 'software':
                        college = '软件学院'
                    else:
                        college = '其他学院'

                    currUser.update(college=college, changetime=timezone.now())
                elif info_k == 'major':
                    if info_v == 'csplus':
                        major = '计算机科学与技术（卓越班）'
                    elif info_v == 'cs':
                        major = '计算机科学与技术'
                    elif info_v == 'iot':
                        major = '物联网工程'
                    elif info_v == 'is':
                        major = '信息安全'
                    else:
                        major = '其他专业'

                    currUser.update(major=major, changetime=timezone.now())
                elif info_k == 'phone':
                    currUser.update(telephone=info_v, changetime=timezone.now())
                elif info_k == 'email':
                    currUser.update(email=info_v, changetime=timezone.now())

            response['status'] = 'ok'
            return HttpResponse(json.dumps(response), status=200)
    except:
        response['status'] = 'error'
        return HttpResponse(json.dumps(response), status=500)


'''
url: /examonline/deleteUser
use: 用于管理者删除用户
http: post 改
content: userID 
'''
def delete_user(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    admin_ID = get_username(request_token)

    if UserInfo.objects.get(userID=admin_ID).identify == 'admin':
        userID = json.loads(request.body.decode('utf-8'))['userID']

        UserInfo.objects.filter(userID=userID).delete()        

        response['status'] = 'ok'
        return HttpResponse(json.dumps(response), status=200)


    response['status'] = 'error'
    return HttpResponse(json.dumps(response), status=500)


'''
url: /examonline/getProblems
use: 用于展示所有题目
http: GET
'''
def get_problems(request):
    assert request.method == 'GET'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    if UserInfo.objects.get(userID=userID).identify == 'admin' or \
        UserInfo.objects.get(userID=userID).identify == 'teacher':
        all_problems = list(TestQuestions.objects.filter(is_audited=1).values())

        # 数据库日期类型不可被json转换
        response['data'] = list()
        for problem in all_problems:
            tmp = dict()

            tmp['proid'] = problem['tqID']
            tmp['name'] = problem['name']
            tmp['tags'] = problem['tags']
            tmp['type'] = problem['tqType']
            tmp['creator'] = problem['creator']
            tmp['difficulty'] = problem['difficulty']

            creatorID = problem['creator']
            tmp['creatorname'] = UserInfo.objects.get(userID=creatorID).name

            response['data'].append(tmp)

        response['status'] = 'ok'
        return HttpResponse(json.dumps(response), status=200)
    
    response['status'] = 'error'
    return HttpResponse(json.dumps(response), status=500)


'''
url: /examonline/addProblem
use: 用于添加题目以及测试用例
http: put
content: tqType / name / tags / content / answer / limit / cases / examples  / creator
'''
def add_problem(request):
    assert request.method == 'PUT'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    no_stuID = get_username(request_token)

    try:
        if UserInfo.objects.get(userID=no_stuID).identify == 'admin' or \
            UserInfo.objects.get(userID=no_stuID).identify == 'teacher':
            # 处理数据
            problem_json = json.loads(request.body.decode('utf-8'))

            tqType = problem_json['proType']
            tqID = \
                str(timezone.now().year) + str(timezone.now().month).rjust(2, '0') + str(timezone.now().day).rjust(2, '0') \
                    + str(timezone.now().hour + 8).rjust(2, '0') + str(timezone.now().minute).rjust(2, '0') \
                        + str(random.randint(0, 100)).rjust(2, '0') \
                            + ('1' if tqType == '填空题' else '2')
            creator = no_stuID  # 试题创建者ID
            name = problem_json['name']
            
            tags = list()
            for tag in problem_json['tags']:
                tags.append(tag)

            content = problem_json['content']
            difficulty = problem_json['difficulty']
            
            if tqType == '填空题':
                # 多个答案将会以列表形式存储，只要匹配上一个，即为对
                # 一个答案里有多个参数，将以,区分
                answer = str(problem_json['answers'])
                inputnum = int(problem_json['inputnum'])

                TestQuestions.objects.create(
                    tqID=tqID,
                    tqType=tqType,
                    name=name,
                    tags=str(tags),
                    content=content,
                    answer=answer,
                    creator=creator,
                    inputnums=inputnum,
                    difficulty=difficulty,
                    is_audited=1,
                )
            elif tqType == '编码题':
                limit = problem_json['limits']
                TestQuestions.objects.create(
                    tqID=tqID,
                    tqType=tqType,
                    name=name,
                    tags=tags,
                    content=content,
                    limit=limit,
                    creator=creator,
                    difficulty=difficulty,
                    is_audited=1,
                )

                # 示例处理
                # 前端将所有输入、输出示例的分别存放在两个数组中
                # 一个输入、输出示例即为对应数组的一个元素
                for example in problem_json['examples']:      
                    AnswerExamples.objects.create(
                        tqID=tqID,
                        cInput=example['input'],
                        cOutput=example['output'],
                        creator=creator,
                    )

                # 测试用例处理
                # 前端将所有测试用例存放到同一数组中，一个测试用例即为对应数组的一个元素
                for case in problem_json['cases']:
                    TestExamples.objects.create(
                        tqID=tqID,
                        cInput=case['input'],
                        cOutput=case['output'],
                        creator=creator,
                    )
            
            response['status'] = 'ok'
            return HttpResponse(json.dumps(response), status=200)
    except:
        response['status'] = 'error'
        return HttpResponse(json.dumps(response), status=200)

'''
url: /examonline/getthePro
use: 用于展示当前题目具体信息
http: POST
content: tqID
'''
def get_thePro(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    if UserInfo.objects.get(userID=userID):
        proID = request.body.decode('utf-8')
        problem_data = TestQuestions.objects.get(tqID=proID)

        # 数据库日期类型不可被json转换
        response['data'] = dict()
        response['data']['type'] = problem_data.tqType
        response['data']['name'] = problem_data.name
        response['data']['tags'] = problem_data.tags
        response['data']['content'] = problem_data.content
        response['data']['answers'] = problem_data.answer
        response['data']['limit'] = problem_data.limit
        response['data']['difficulty'] = problem_data.difficulty

        if problem_data.tqType == '填空题':
            response['data']['inputnum'] = problem_data.inputnums
        elif problem_data.tqType == '编码题':
            response['data']['examples'] = list()
            response['data']['cases'] = list()

            # 示例
            examples = list(AnswerExamples.objects.filter(tqID=proID).values())
            for example in examples:
                tmp = dict()

                tmp['input'] = example['cInput']
                tmp['output'] = example['cOutput']

                response['data']['examples'].append(tmp)
            
            # 测试用例
            cases = list(TestExamples.objects.filter(tqID=proID).values())
            for case in cases:
                tmp = dict()

                tmp['input'] = case['cInput']
                tmp['output'] = case['cOutput']

                response['data']['cases'].append(tmp)

        response['status'] = 'ok'
        return HttpResponse(json.dumps(response), status=200)

    response['status'] = 'error'
    return HttpResponse(json.dumps(response), status=200)

'''
url: /examonline/changePro
use: 用于展示当前题目具体信息
http: POST
content: name / tags / content / answer / limit / cases / examples
'''
def change_pro(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    try:
        if UserInfo.objects.get(userID=userID).identify == 'admin' or \
            UserInfo.objects.get(userID=userID).identify == 'teacher':
            change_json = json.loads(request.body.decode('utf-8'))
            
            tqID = change_json['proID']
            nc_problem = TestQuestions.objects.filter(tqID=tqID)

            for pro_k, pro_v in change_json.items():
                if pro_k == 'proType':
                    pass
                elif pro_k == 'examples':
                    AnswerExamples.objects.filter(tqID=tqID).delete()

                    for example in pro_v:      
                        AnswerExamples.objects.create(
                            tqID=tqID,
                            cInput=example['input'],
                            cOutput=example['output'],
                            creator=userID,
                        )
                elif pro_k == 'cases':
                    TestExamples.objects.filter(tqID=tqID).delete()

                    for case in pro_v:
                        TestExamples.objects.create(
                            tqID=tqID,
                            cInput=case['input'],
                            cOutput=case['output'],
                            creator=userID,
                        )
                elif pro_k == 'name':
                    nc_problem.update(name=pro_v, changetime=timezone.now())
                elif pro_k == 'answers':
                    nc_problem.update(answer=pro_v, changetime=timezone.now())
                elif pro_k == 'tags':
                    tags = list()
                    for tag in pro_v:
                        tags.append(tag)
                    nc_problem.update(tags=str(tags), changetime=timezone.now())
                elif pro_k == 'limits':
                    nc_problem.update(limit=pro_v, changetime=timezone.now())
                elif pro_k == 'content':
                    nc_problem.update(content=pro_v, changetime=timezone.now())
                elif pro_k == 'inputnum':
                    nc_problem.update(inputnums=pro_v, changetime=timezone.now())
                elif pro_k == 'difficulty':
                    nc_problem.update(difficulty=pro_v, changetime=timezone.now())

            response['status'] = 'ok'
            return HttpResponse(json.dumps(response), status=200)
    except:
        response['status'] = 'error'
        return HttpResponse(json.dumps(response), status=200)


'''
url: /examonline/deletePro
use: 用于删除对应题目
http: POST
content: tqID
'''
def delete_pro(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    try:
        if UserInfo.objects.get(userID=userID).identify == 'admin' or \
            UserInfo.objects.get(userID=userID).identify == 'teacher':
            proID = json.loads(request.body.decode('utf-8'))['proID']

            nd_problem = TestQuestions.objects.get(tqID=proID)
            proType = nd_problem.tqType

            # 删除 试题表 中相关信息
            TestQuestions.objects.filter(tqID=proID).delete()

            # 如果是编码题，还需要删除对应的示例信息与测试用例信息
            if proType == '编码题':
                TestExamples.objects.filter(tqID=proID).delete()
                AnswerExamples.objects.filter(tqID=proID).delete()

            response['status'] = 'ok'
            return HttpResponse(json.dumps(response), status=200)
    except:
        response['status'] = 'error'
        return HttpResponse(json.dumps(response), status=200)


'''
url: /examonline/getExams
use: 用于展示所有考试信息，可用于所有身份
http: GET
'''
def get_exams(request):
    assert request.method == 'GET'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token

    all_tests = list(ExamInfo.objects.filter().values())

    # 数据库日期类型不可被json转换
    response['data'] = list()
    for test in all_tests:
        tmp = dict()

        tmp['name'] = test['name']
        tmp['examID'] = test['examID']
        tmp['startTime'] = str(test['startTime'])[:19]
        tmp['endTime'] = str(test['endTime'])[:19]
        tmp['creatorID'] = test['creator']
        tmp['creatorName'] = UserInfo.objects.get(userID=test['creator']).name

        response['data'].append(tmp)
    
    response['success'] = True
    return HttpResponse(json.dumps(response), status=200)


'''
url: /examonline/addExam
use: 用于创建考试
http: PUT
content: name / datetime(length == 2) / type(自由/综合) / tags && nums
'''
def add_exam(request):
    assert request.method == 'PUT'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    # try:
    if UserInfo.objects.get(userID=userID).identify == 'admin' or \
        UserInfo.objects.get(userID=userID).identify == 'teacher':
        msg = json.loads(request.body.decode('utf-8'))
        print(msg)
        
        # 考试场次与名称
        examID = \
            str(timezone.now().year) + str(timezone.now().month).rjust(2, '0') + str(timezone.now().day).rjust(2, '0') \
                + str(timezone.now().hour + 8).rjust(2, '0') + str(timezone.now().minute).rjust(2, '0') \
                    + str(random.randint(0, 100)).rjust(2, '0') \
                        + ('1' if msg['type'] == '综合组卷' else '2')
        name = msg['name']

        # 考试开始、结束、持续时间
        startTime = msg['datetime'][0]
        endTime = msg['datetime'][1]
        duraTime = msg['duratime']
        
        # 创建者
        creator = userID

        # 组卷
        tqlist = set()  # 已选题目列表
        total, f_total, p_total = 10, 5, 5 # 限制十道题，且填空五道，编码五道
        if msg['type'] == '综合组卷':
            while total > 0:
                pros = list(TestQuestions.objects.filter(is_audited=1).values('tqID', 'name', 'tqType', 'tags', 'aqtimes'))
                leng = len(pros)

                tmp = random.randint(0, leng - 1)
                while pros[tmp]['tqID'] in tqlist:
                    tmp = random.randint(0, leng - 1)
                
                if pros[tmp]['tqType'] == '填空题' and f_total > 0:
                    tqlist.add(pros[tmp]['tqID'])
                    f_total -= 1
                    total -= 1
                elif pros[tmp]['tqType'] == '编码题' and p_total > 0:
                    tqlist.add(pros[tmp]['tqID'])
                    p_total -= 1
                    total -= 1
        elif msg['type'] == '自由组卷':
            for tn in msg['tns']:
                nums = int(tn['nums'])
                if total - nums >= 0:
                    # 检索题库里相关标签的试题
                    # 字符串匹配 == %content%
                    pros = list(TestQuestions.objects.filter(tags__contains=tn['tags'], is_audited=1).values('tqID', 'name', 'tqType', 'tags', 'aqtimes'))
                    
                    # 后期引入组卷算法，需要考虑试题当前次数等权重影响
                    leng = len(pros)
                    for _ in range(nums):
                        # 目前先用着随机值组卷
                        tmp = random.randint(0, leng - 1)
                        
                        # 避免试题重复选择
                        t_chosed = set()  # 当前类型已选择的题目
                        while pros[tmp]['tqID'] in tqlist:
                            tmp = random.randint(0, leng - 1)
                            
                            # 为防止该标签类型的题目，已经通过别个标签选择时选择进入考试列表
                            t_chosed.add(pros[tmp]['tqID'])
                            if len(t_chosed) == leng:
                                break
                        if len(t_chosed) == leng:
                            break

                        if pros[tmp]['tqType'] == '填空题' and f_total >= 1:
                            f_total -= 1
                            total -= 1
                            tqlist.add(pros[tmp]['tqID'])
                        elif pros[tmp]['tqType'] == '编码题' and p_total >= 1:
                            p_total -= 1
                            total -= 1
                            tqlist.add(pros[tmp]['tqID'])
                        else:
                            break

                        print(tqlist)
                else:
                    response['status'] = 'num error'
                    return HttpResponse(json.dumps(response), status=200)
            
            # 遍历完要求类型题目后，仍不够十题，将会在题库中任意选取足够题目
            while total > 0:
                pros = list(TestQuestions.objects.filter(is_audited=1).values('tqID', 'name', 'tqType', 'tags', 'aqtimes'))
                leng = len(pros)

                tmp = random.randint(0, leng - 1)
                while pros[tmp]['tqID'] in tqlist:
                    tmp = random.randint(0, leng - 1)
                
                if pros[tmp]['tqType'] == '填空题' and f_total > 0:
                    tqlist.add(pros[tmp]['tqID'])
                    f_total -= 1
                    total -= 1
                elif pros[tmp]['tqType'] == '编码题' and p_total > 0:
                    tqlist.add(pros[tmp]['tqID'])
                    p_total -= 1
                    total -= 1

        # 存入数据库
        ExamInfo.objects.create(
            examID=examID,
            name=name,
            startTime=startTime,
            endTime=endTime,
            duraTime=duraTime,
            eqlist=list(tqlist),
            creator=creator,
        )
        for tqID in tqlist:
            cnt = TestQuestions.objects.get(tqID=tqID).aqtimes + 1
            curr_question = TestQuestions.objects.filter(tqID=tqID)
            curr_question.update(aqtimes=cnt)

        response['status'] = 'ok'
        return HttpResponse(json.dumps(response), status=200)
    # except:
    #     response['status'] = 'error'
    #     return HttpResponse(json.dumps(response), status=200)


'''
url: /examonline/gettheExam
use: 用于展示当前考试具体信息，仅服务于管理者端与教师端
http: POST
content: examID
'''
def get_theExam(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    if UserInfo.objects.get(userID=userID).identify == 'admin' or \
        UserInfo.objects.get(userID=userID).identify == 'teacher':
        response['data'] = dict()

        # 处理发送过来的考试场次ID
        examID = request.body.decode('utf-8')
        examContent = ExamInfo.objects.get(examID=examID)

        response['data']['exname'] = examContent.name
        response['data']['startTime'] = str(examContent.startTime)[:-6]
        response['data']['endTime'] = str(examContent.endTime)[:-6]
        response['data']['duraTime'] = examContent.duraTime

        response['data']['exPro'] = list()
        eqids = json.loads(examContent.eqlist.replace('\'', '\"'))  # json str -> list，引号严格使用双引号
        for eqid in eqids:
            curr = TestQuestions.objects.get(tqID=eqid)

            tmp = dict()
            tmp['eqname'] = curr.name
            tmp['eqType'] = curr.tqType
            tmp['tags'] = curr.tags
            tmp['content'] = curr.content
            tmp['eqID'] = curr.tqID

            response['data']['exPro'].append(tmp)

        response['status'] = 'ok'
        return HttpResponse(json.dumps(response), status=200)
    
    response['status'] = 'error'
    return HttpResponse(json.dumps(response), status=500)


'''
url: /examonline/changeExam
use: 用于修改当前考试具体信息，仅服务于管理者端与教师端
http: POST
content: exname / startTime / endTime / duraTime / eqs(试题列表)
'''
def change_exam(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    # 处理数据
    msg = json.loads(request.body.decode('utf-8'))
    examID = msg['examID']
    curr_exam = ExamInfo.objects.get(examID=examID)

    # 判断开始结束时间
    # 格式化时间转换为时间戳： str格式化时间 -> 映射tuple（year、month...） -> 时间戳
    stime = int(time.mktime(time.strptime(str(curr_exam.startTime), '%Y-%m-%d %H:%M:%S')))
    etime = int(time.mktime(time.strptime(str(curr_exam.endTime), '%Y-%m-%d %H:%M:%S')))
    ntime = int(time.mktime(time.strptime(str(timezone.now())[:-7], '%Y-%m-%d %H:%M:%S')))

    try:
        if (UserInfo.objects.get(userID=userID).identify == 'admin' or \
            UserInfo.objects.get(userID=userID).identify == 'teacher') and \
                ntime < stime:

            for ex_k, ex_v in msg.items():
                if ex_k == 'examID':
                    pass
                elif ex_k == 'eqname':
                    # 由于前端组件在不刷新基础上，会保留该项空值，所以要做后端一个判断，以免异常
                    if len(ex_v) > 0:
                        ExamInfo.objects.filter(examID=examID).update(name=ex_v, changetime=datetime.now())
                elif ex_k == 'datetime':
                    if len(ex_v) > 0:
                        ExamInfo.objects.filter(examID=examID).update(startTime=ex_v[0], endTime=ex_v[1], changetime=datetime.now())
                elif ex_k == 'duratime':
                    if len(ex_v) > 0:
                        ExamInfo.objects.filter(examID=examID).update(duraTime=ex_v, changetime=datetime.now())
                elif ex_k == 'eqs':
                    if len(ex_v) > 0:
                        eqlist = json.loads(list(ExamInfo.objects.filter(examID=examID).values('eqlist')).pop()['eqlist'].replace('\'', '\"'))
                        for eqid in ex_v:
                            for tqID in eqlist:
                                # 修改项应不在原列表中方可修改成功
                                if tqID == eqid['nc_eq'] and eqid['wc_eq'] not in eqlist:
                                    eqlist.remove(tqID)
                                    eqlist.append(eqid['wc_eq'])
                                    
                                    # 数据库更改
                                    cnt_nc = TestQuestions.objects.get(tqID=tqID).aqtimes - 1
                                    TestQuestions.objects.filter(tqID=tqID).update(aqtimes=cnt_nc)

                                    cnt_wc = TestQuestions.objects.get(tqID=eqid['wc_eq']).aqtimes + 1
                                    TestQuestions.objects.filter(tqID=eqid['wc_eq']).update(aqtimes=cnt_wc)
                                else:
                                    response['status'] = 'change eqlist error'
                                    return HttpResponse(json.dumps(response), status=200)
                        ExamInfo.objects.filter(examID=examID).update(eqlist=eqlist, changetime=datetime.now())

            response['status'] = 'ok'
            return HttpResponse(json.dumps(response), status=200)
        else:
            response['status'] = 'wrong'
            return HttpResponse(json.dumps(response), status=200)
    except:
        response['status'] = 'error'
        return HttpResponse(json.dumps(response), status=500)


'''
url: /examonline/deleteExam
use: 用于删除当前考试，仅服务于管理者端与教师端
http: POST
content: examID
'''
def delete_exam(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    try:
        if UserInfo.objects.get(userID=userID).identify == 'admin' or \
            UserInfo.objects.get(userID=userID).identify == 'teacher':
            examID = json.loads(request.body.decode('utf-8'))['examID']

            ExamInfo.objects.filter(examID=examID).delete()

            response['status'] = 'ok'
            return HttpResponse(json.dumps(response), status=200)
    except:
        response['status'] = 'error'
        return HttpResponse(json.dumps(response), status=200)


'''
url: /examonline/stuGetExam
use: 用于学生参与考试，仅服务于学生端，由于时间关系，需要另外写一个接口特殊处理
http: POST
content: examID
'''
def stu_getExam(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)
    curr_user = UserInfo.objects.get(userID=userID)

    # 考试信息
    examID = request.body.decode('utf-8')
    curr_exam = ExamInfo.objects.get(examID=examID)

    # 判断开始结束时间
    # 格式化时间转换为时间戳： str格式化时间 -> 映射tuple（year、month...） -> 时间戳
    stime = int(time.mktime(time.strptime(str(curr_exam.startTime), '%Y-%m-%d %H:%M:%S')))
    etime = int(time.mktime(time.strptime(str(curr_exam.endTime), '%Y-%m-%d %H:%M:%S')))
    ntime = int(time.mktime(time.strptime(str(timezone.now())[:-7], '%Y-%m-%d %H:%M:%S')))

    if ntime > etime or ntime < stime:
        response['status'] = 'time error'
        return HttpResponse(json.dumps(response), status=200)

    if curr_user.identify == 'student':
        # 已经参加过该场考试，无法再参加
        # 教师端或者管理者端可以在考试记录一栏，将某位学生的考试记录删除，即可应付异常情况导致需要再次参与考试
        if StuExamEvent.objects.filter(userID=userID, examID=examID):
            response['status'] = 'join error'
            return HttpResponse(json.dumps(response), status=200)
        # 注入数据库事件中
        StuExamEvent.objects.create(
            userID=userID,
            examID=examID,
            eventType='join',
        )

        response['data'] = list()

        # 处理考试内容
        eqlist = json.loads(curr_exam.eqlist.replace('\'', '\"'))
        for eq in eqlist:
            tmp = dict()

            curr_eq = TestQuestions.objects.get(tqID=eq)
            tmp['eqName'] = curr_eq.name
            tmp['eqType'] = curr_eq.tqType
            tmp['eqID'] = curr_eq.tqID
            tmp['content'] = curr_eq.content
            if curr_eq.tqType == '编码题':
                tmp['examples'] = list()

                examples =  list(AnswerExamples.objects.filter(tqID=eq).values())
                for example in examples:
                    tmp_exa = dict()

                    tmp_exa['input'] = example['cInput']
                    tmp_exa['output'] = example['cOutput']

                    tmp['examples'].append(tmp_exa)
        
            response['data'].append(tmp)
        response['duratime'] = curr_exam.duraTime

        response['status'] = 'success'
        return HttpResponse(json.dumps(response), status=200)
    
    response['status'] = 'error'
    return HttpResponse(json.dumps(response), status=500)


'''
url: /examonline/exitExam
use: 用于结束并退出考试
http: post
content: examID
'''
def exit_exam(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    # 考试信息
    examID = request.body.decode('utf-8')

    # 总分统计
    response['score'] = 0

    eqlist = json.loads(''.join(ExamInfo.objects.get(examID=examID).eqlist).replace('\'', '\"'))  # 本场考试涉及所有考题
    for tqID in eqlist:
        try:
            all_submits = list(StuExamSubmit.objects.filter(examID=examID, userID=userID, tqID=tqID).values('score'))

            smax = 0
            for submit in all_submits:
                smax = submit['score'] if submit['score'] > smax else smax

            response['score'] += smax
        except:
            pass

    # 注入数据库
    StuExamEvent.objects.create(
        userID=userID,
        examID=examID,
        eventType='end',
    )

    response['status'] = 'end'
    return HttpResponse(json.dumps(response), status=200)


'''
url: /examonline/sendAbnormal
use: 用于监考
http: post
content: examID / type / content
'''
def send_abnormal(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    # 处理数据
    msg = json.loads(request.body.decode('utf-8'))
    examID = msg['examID']
    eType = msg['type']
    event = msg['content']

    try:
        # 考试开始3s后再进行异常检测
        ntime = int(time.mktime(time.strptime(str(timezone.now())[:-7], '%Y-%m-%d %H:%M:%S')))
        stime = int(time.mktime(time.strptime(str(StuExamEvent.objects.get(userID=userID, examID=examID, eventType='join').addTime)[:-7], '%Y-%m-%d %H:%M:%S')))
        is_end = False if len(list(StuExamEvent.objects.filter(userID=userID, examID=examID, eventType='end').values())) == 0 else True
        if ntime - stime <= 3:
            pass
        # 防止结束考试后还会进行监控并注入数据库造成数据异常情况
        elif ntime - stime > 3 and not is_end:
            # 注入数据库
            StuExamEvent.objects.create(
                userID=userID,
                examID=examID,
                eventType=eType,
                event=event, 
            )

        response['status'] = 'success'
        return HttpResponse(json.dumps(response), status=200)
    except:
        response['status'] = 'wrong'
        return HttpResponse(json.dumps(response), status=200)


'''
url: /examonline/testProgram
use: 用于测试程序
http: post
content: examID / tqID / code
'''
def test_program(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    if UserInfo.objects.get(userID=userID).identify == 'student':
        # 处理数据
        message = json.loads(request.body.decode('utf-8'))
        
        examID = message['examID']
        tqID = message['tqID']

        # 限制条件，如超时、内存，暂未完成
        limits = TestQuestions.objects.get(tqID=tqID).limit

        tes = list(TestExamples.objects.filter(tqID=tqID).values('cInput', 'cOutput'))
        passednum, alltesnum = 0, len(tes)  # 通过用例数

        if message['type'] == 'Python':
            with open('./temp_program/' + userID + '+' + tqID + '.py', 'w', encoding='utf-8') as pyfile:
                pyfile.write(message['code'])
            
            for te in tes:
                run_order = 'python ./temp_program/' + userID + '+' + tqID + '.py ' + te['cInput']
                state, run_output = subprocess.getstatusoutput(run_order)

                # 程序运行错误
                if state == 1:
                    # 注入数据库
                    StuExamSubmit.objects.create(
                        userID=userID,
                        examID=examID,
                        tqID=tqID,
                        content=message['code'],
                        score=(passednum / alltesnum) * 15,
                    )

                    response['status'] = 'program run failed'
                    response['content'] = '通过测试用例数：' + str(passednum) + '/' + str(alltesnum) + '\n' + run_output
                    return HttpResponse(json.dumps(response), status=200)
                # 程序运行正常
                elif state == 0:
                    if run_output == te['cOutput']:
                        passednum += 1
                    else:
                        # 注入数据库
                        StuExamSubmit.objects.create(
                            userID=userID,
                            examID=examID,
                            tqID=tqID,
                            content=message['code'],
                            score=(passednum / alltesnum) * 15,
                        )

                        response['status'] = 'program run failed'
                        response['content'] = '通过测试用例数：' + str(passednum) + '/' + str(alltesnum) + '\n' + run_output
                        return HttpResponse(json.dumps(response), status=200)

        # 注入数据库
        StuExamSubmit.objects.create(
            userID=userID,
            examID=examID,
            tqID=tqID,
            content=message['code'],
            score=(passednum / alltesnum) * 15,
        )

        response['status'] = 'program success run'
        return HttpResponse(json.dumps(response), status=200)

    response['status'] = 'submit error'
    return HttpResponse(json.dumps(response), status=200)


'''
url: /examonline/testfill
use: 用于提交填空题
http: post
content: fill answers
'''
def test_fill(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    if UserInfo.objects.get(userID=userID).identify == 'student':
        # 处理数据
        message = json.loads(request.body.decode('utf-8'))
        
        examID = message['examID']
        tqID = message['tqID']
        fanswers = message['fanswers']

        # 提取对应题目
        tq = TestQuestions.objects.get(tqID=tqID)
        tqAnswer = tq.answer
        tqContent = ''.join(tq.content)  # 字符串拷贝
        tqInputs = int(tq.inputnums)

        # 遍历答案
        # 如果答案段数不一，直接返回提交失败
        if len(fanswers) != tqInputs:
            response['status'] = 'fill write wrong'
            return HttpResponse(json.dumps(response), status=200)
        # 否则替换文本且写入cpp文件
        filename = userID + '+' + tqID
        for answer in fanswers:
            tqContent = tqContent.replace('___', answer['input'], 1)  # 每个答案只替换一次
        with open('./filling_problems/' + filename + '.cpp', 'w', encoding='utf-8') as fillFile:
            fillFile.write(tqContent)
        print(0)

        # 编译提交代码: g++ 编译 ./a.exe 执行 
        compile_order = 'cd .\\filling_problems\\ && g++ -o '+ filename + ' ' + filename +'.cpp'
        subprocess.getstatusoutput(compile_order)

        run_order = '.\\filling_problems\\' + filename + '.exe'
        run_output = subprocess.getoutput(run_order)
        
        # 编译并运行数据库中标准答案
        with open('./filling_problems/' + tqID + '.cpp', 'w', encoding='utf-8') as tqFile:
            tqFile.write(tqContent)
        tq_compile = 'cd .\\filling_problems\\ && g++ -o '+ tqID + ' ' + tqID +'.cpp'
        subprocess.getstatusoutput(tq_compile)

        tq_run = '.\\filling_problems\\' + tqID + '.exe'
        tq_output = subprocess.getoutput(tq_run)

        # 注入数据库
        if run_output == tq_output:
            score = 5  # 得分
        else:
            score = 0
        StuExamSubmit.objects.create(
            userID=userID,
            examID=examID,
            tqID=tqID,
            content=fanswers,
            score=score,
        )

        response['status'] = 'fill submit success'
        return HttpResponse(json.dumps(response), status=200)


    response['status'] = 'submit error'
    return HttpResponse(json.dumps(response), status=200)


'''
url: /examonline/getScore
use: 用于获取成绩等统计情况
http: post
content: examID
'''
def get_score(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    # 处理数据
    examID = request.body.decode('utf-8')
    curr_exam = ExamInfo.objects.get(examID=examID)

    # 判断开始结束时间
    # 格式化时间转换为时间戳： str格式化时间 -> 映射tuple（year、month...） -> 时间戳
    etime = int(time.mktime(time.strptime(str(curr_exam.endTime), '%Y-%m-%d %H:%M:%S')))
    ntime = int(time.mktime(time.strptime(str(timezone.now())[:-7], '%Y-%m-%d %H:%M:%S')))

    # 判断身份，并且当考试完全结束后，这个成绩、异常情况统计才有意义
    if (UserInfo.objects.get(userID=userID).identify == 'admin' or \
        UserInfo.objects.get(userID=userID).identify == 'teacher') and \
            ntime >= etime:
        response['data'] = dict()

        # 检索并处理当场考试所有参与者
        all_submits = list(StuExamSubmit.objects.filter(examID=examID).values('userID'))

        all_students = set()
        for curr_student in all_submits:
            all_students.add(curr_student['userID'])

        # 检索当场考试的有关题目以及涉及标签
        eqlist = json.loads(''.join(ExamInfo.objects.get(examID=examID).eqlist).replace('\'', '\"'))
        all_problems = list()
        all_tags = set()
        for tqID in eqlist:
            curr_pro = list(TestQuestions.objects.filter(tqID=tqID).values('tqID', 'tags')).pop()
            
            for tag in json.loads(curr_pro['tags'].replace('\'', '\"')):
                all_tags.add(tag)

            all_problems.append(curr_pro)

        # 参与人数与题目总数
        s_num, p_num = len(all_students), 10

        # 考试基本信息
        response['data']['basic'] = dict()
        response['data']['basic']['name'] = curr_exam.name
        response['data']['basic']['stunums'] = s_num
        response['data']['basic']['examID'] = examID
        response['data']['basic']['startTime'] = str(curr_exam.startTime)
        response['data']['basic']['endTime'] = str(curr_exam.endTime)

        # 成绩统计
        response['data']['PScore'] = list()  # 题目分数

        # 标签分数
        response['data']['TScore'] = list() 
        for tag in all_tags:
            tmp = dict()
            tmp['type'] = tag
            tmp['value'] = 0
            response['data']['TScore'].append(tmp)

        for index in range(p_num):
            ptmp = dict()

            curr_tqID = all_problems[index]['tqID']
            curr_tqName = TestQuestions.objects.get(tqID=curr_tqID).name
            curr_tags = json.loads(all_problems[index]['tags'].replace('\'', '\"'))
            curr_pscores, curr_tscores = 0, 0

            for stuID in all_students:
                curr_score = list(StuExamSubmit.objects.filter(userID=stuID, examID=examID, tqID=curr_tqID).values('score'))
                
                # 找出当前题目该名同学多次提交记录中所得最高分数
                tmax = 0
                for s in curr_score:
                    if s['score'] >= tmax:
                        tmax = s['score']
                curr_pscores += tmax

            # 题目分数
            ptmp['type'] = curr_tqName
            ptmp['value'] = curr_pscores

            response['data']['PScore'].append(ptmp)

            # 标签分数
            for tag in curr_tags:
                for ts in response['data']['TScore']:
                    if tag == ts['type']:
                        ts['value'] += curr_pscores

        # 异常统计
        response['data']['Abnormal'] = list()
        abnos = list(StuExamEvent.objects.filter(examID=examID, eventType='Abnormal').values('userID', 'event', 'addTime'))
        for abno in abnos:
            tmp = dict()

            tmp['id'] = abno['userID']
            tmp['name'] = UserInfo.objects.get(userID=abno['userID']).name
            tmp['content'] = abno['event']
            tmp['time'] = str(abno['addTime'])[:-7]
            
            response['data']['Abnormal'].append(tmp)

        response['status'] = 'get success'
        return HttpResponse(json.dumps(response), status=200)
    
    response['status'] = 'get wrong'
    return HttpResponse(json.dumps(response), status=200)


'''
url: /examonline/Invigilation
use: 用于监考
http: post
content: examID
'''
def invigilation(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    # 处理数据
    examID = request.body.decode('utf-8')
    curr_exam = ExamInfo.objects.get(examID=examID)
    
    # 判断开始结束时间
    # 格式化时间转换为时间戳： str格式化时间 -> 映射tuple（year、month...） -> 时间戳
    stime = int(time.mktime(time.strptime(str(curr_exam.startTime), '%Y-%m-%d %H:%M:%S')))
    etime = int(time.mktime(time.strptime(str(curr_exam.endTime), '%Y-%m-%d %H:%M:%S')))
    ntime = int(time.mktime(time.strptime(str(timezone.now())[:-7], '%Y-%m-%d %H:%M:%S')))

    # 判断身份
    if (UserInfo.objects.get(userID=userID).identify == 'admin' or \
        UserInfo.objects.get(userID=userID).identify == 'teacher') and \
            ntime >= stime:
        response['status'] = 'get success'
        return HttpResponse(json.dumps(response), status=200)
    
    response['status'] = 'get wrong'
    return HttpResponse(json.dumps(response), status=200)


'''
url: /examonline/getSubmits
use: 用于监考中获取题目提交情况
http: post
content: examID
'''
def get_submits(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    # 处理数据
    examID = request.body.decode('utf-8')

    # 判断身份
    if (UserInfo.objects.get(userID=userID).identify == 'admin' or \
        UserInfo.objects.get(userID=userID).identify == 'teacher'):
        all_submits = list(StuExamSubmit.objects.filter(examID=examID).values())

        response['data'] = list()
        for submit in all_submits:
            tmp = dict()

            tmp['userID'] = submit['userID']
            tmp['name'] = UserInfo.objects.get(userID=submit['userID']).name
            tmp['tqID'] = submit['tqID']
            tmp['tqName'] = TestQuestions.objects.get(tqID=submit['tqID']).name
            tmp['content'] = submit['content']
            tmp['score'] = submit['score']
            tmp['time'] = str(submit['addTime'])[:-7]

            response['data'].append(tmp)

        response['status'] = 'get success'
        return HttpResponse(json.dumps(response), status=200)
    
    response['status'] = 'get wrong'
    return HttpResponse(json.dumps(response), status=200)

'''
url: /examonline/getAbnormals
use: 用于监考中获取异常情况
http: post
content: examID
'''
def get_abnormals(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    # 处理数据
    examID = request.body.decode('utf-8')

    # 判断身份
    if (UserInfo.objects.get(userID=userID).identify == 'admin' or \
        UserInfo.objects.get(userID=userID).identify == 'teacher'):
        response['data'] = list()

        all_abnormals = list(StuExamEvent.objects.filter(examID=examID, eventType='Abnormal').values())

        for abnoraml in all_abnormals:
            tmp = dict()

            tmp['userID'] = abnoraml['userID']
            tmp['name'] = UserInfo.objects.get(userID=abnoraml['userID']).name
            tmp['event'] = abnoraml['event']
            tmp['time'] = str(abnoraml['addTime'])[:-7]

            response['data'].append(tmp)

        response['status'] = 'get success'
        return HttpResponse(json.dumps(response), status=200)
    
    response['status'] = 'get wrong'
    return HttpResponse(json.dumps(response), status=200)


'''
url: /examonline/getRecords
use: 用于获取所有参考记录
http: get
'''
def get_records(request):
    assert request.method == 'GET'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    if (UserInfo.objects.get(userID=userID).identify == 'admin' or \
        UserInfo.objects.get(userID=userID).identify == 'teacher'):
        response['data'] = list()

        all_events = list(StuExamEvent.objects.filter().distinct().values('userID', 'examID'))
        
        for event in all_events:
            tmp = dict()

            tmp['userID'] = event['userID']
            tmp['name'] = UserInfo.objects.get(userID=event['userID']).name
            tmp['examID'] = event['examID']
            tmp['examName'] = ExamInfo.objects.get(examID=event['examID']).name

            response['data'].append(tmp)

        response['status'] = 'get success'
        return HttpResponse(json.dumps(response), status=200)

    response['status'] = 'get wrong'
    return HttpResponse(json.dumps(response), status=200)


'''
url: /examonline/getRecord
use: 用于获取个人参考记录
http: post
content: examID / stuID
'''
def get_record(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    if (UserInfo.objects.get(userID=userID).identify == 'admin' or \
        UserInfo.objects.get(userID=userID).identify == 'teacher'):
        response['data'] = list()
        response['basic'] = dict()

        # 处理数据
        msg = json.loads(request.body.decode('utf-8'))
        examID = msg['examID']
        stuID = msg['userID']  # 学生id
        
        # 考试基础信息
        response['basic']['ename'] = ExamInfo.objects.get(examID=examID).name
        response['basic']['name'] = UserInfo.objects.get(userID=stuID).name
        response['basic']['userID'] = stuID
        response['basic']['examID'] = examID

        score = 0
        eqlist = json.loads(''.join(ExamInfo.objects.get(examID=examID).eqlist).replace('\'', '\"'))  # 本场考试涉及所有考题
        for tqID in eqlist:
            try:
                all_submits = list(StuExamSubmit.objects.filter(examID=examID, userID=stuID, tqID=tqID).values('score'))

                smax = 0
                for submit in all_submits:
                    smax = submit['score'] if submit['score'] > smax else smax

                score += smax
            except:
                pass
        response['basic']['score'] = score

        # 考试提交、异常记录
        all_events = list(StuExamEvent.objects.filter(examID=examID, userID=stuID).values())
        all_submits = list(StuExamSubmit.objects.filter(examID=examID, userID=stuID).values())

        for event in all_events:
            tmp = dict()

            tmp['userID'] = stuID
            tmp['name'] = UserInfo.objects.get(userID=stuID).name
            tmp['examID'] = examID
            tmp['ename'] = ExamInfo.objects.get(examID=examID).name
            if event['eventType'] == 'Abnormal':
                tmp['eventType'] = '异常'
            elif event['eventType'] == 'join':
                tmp['eventType'] = '参加'
            elif event['eventType'] == 'end':
                tmp['eventType'] = '退出'
            tmp['event'] = event['event']
            tmp['time'] = str(event['addTime'])[:-7]

            response['data'].append(tmp)
        
        for submit in all_submits:
            tmp = dict()

            tmp['userID'] = stuID
            tmp['name'] = UserInfo.objects.get(userID=stuID).name
            tmp['examID'] = examID
            tmp['ename'] = ExamInfo.objects.get(examID=examID).name
            tmp['eventType'] = '提交'
            tmp['tname'] = TestQuestions.objects.get(tqID=submit['tqID']).name
            tmp['content'] = submit['content']
            tmp['time'] = str(event['addTime'])[:-7]

            response['data'].append(tmp)

        response['status'] = 'get success'
        return HttpResponse(json.dumps(response), status=200)

    response['status'] = 'get wrong'
    return HttpResponse(json.dumps(response), status=200)


'''
url: /examonline/deleteRecord
use: 用于删除个人参考记录
http: post
content: examID / stuID
'''
def delete_record(request):
    assert request.method == 'POST'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    if (UserInfo.objects.get(userID=userID).identify == 'admin' or \
        UserInfo.objects.get(userID=userID).identify == 'teacher'):
        response['data'] = list()

        # 处理数据
        msg = json.loads(request.body.decode('utf-8'))
        examID = msg['examID']
        stuID = msg['userID']  # 学生id

        # 删除数据库
        StuExamEvent.objects.filter(examID=examID, userID=stuID).delete()
        StuExamSubmit.objects.filter(examID=examID, userID=stuID).delete()

        response['status'] = 'get success'
        return HttpResponse(json.dumps(response), status=200)

    response['status'] = 'get wrong'
    return HttpResponse(json.dumps(response), status=200)


'''
url: /examonline/stuGetPros
use: 用于学生获取自己提交的所有题目
http: get
content: userid
'''
def stu_getPros(request):
    assert request.method == 'GET'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    if UserInfo.objects.get(userID=userID).identify == 'student':
        response['data'] = list()

        all_problems = list(TestQuestions.objects.filter(creator=userID).values())
        # 数据库日期类型不可被json转换
        for problem in all_problems:
            tmp = dict()

            tmp['tqID'] = problem['tqID']
            tmp['name'] = problem['name']
            tmp['tags'] = problem['tags']
            tmp['difficulty'] = problem['difficulty']
            tmp['state'] = problem['is_audited']
            tmp['limits'] = problem['limit']

            response['data'].append(tmp)

        return HttpResponse(json.dumps(response), status=200)

    return HttpResponse(status=500)


'''
url: /examonline/stuAddPro
use: 用于学生提交题目
http: put
content: prodata
'''
def stu_addPro(request):
    assert request.method == 'PUT'
    response = dict()

    # 处理 token 
    request_token = request.META['HTTP_AUTHORIZATION']  # 取出token，未解密
    # token_status = check_token(request_token)  # 解密并检验token
    userID = get_username(request_token)

    if UserInfo.objects.get(userID=userID).identify == 'student':
        # 处理数据
        problem_json = json.loads(request.body.decode('utf-8'))

        tqType = '编码题'
        tqID = \
            str(timezone.now().year) + str(timezone.now().month).rjust(2, '0') + str(timezone.now().day).rjust(2, '0') \
                + str(timezone.now().hour + 8).rjust(2, '0') + str(timezone.now().minute).rjust(2, '0') \
                    + str(random.randint(0, 100)).rjust(2, '0') \
                        + '2'
        creator = userID  # 试题创建者ID
        name = problem_json['name']
        
        tags = list()
        for tag in problem_json['tags']:
            tags.append(tag)

        content = problem_json['content']
        difficulty = problem_json['difficulty']

        limit = problem_json['limits']
        TestQuestions.objects.create(
            tqID=tqID,
            tqType=tqType,
            name=name,
            tags=tags,
            content=content,
            limit=limit,
            creator=creator,
            difficulty=difficulty,
            is_audited=0,
        )

        # 示例处理
        # 前端将所有输入、输出示例的分别存放在两个数组中
        # 一个输入、输出示例即为对应数组的一个元素
        for example in problem_json['examples']:      
            AnswerExamples.objects.create(
                tqID=tqID,
                cInput=example['input'],
                cOutput=example['output'],
                creator=creator,
            )

        # 测试用例处理
        # 前端将所有测试用例存放到同一数组中，一个测试用例即为对应数组的一个元素
        for case in problem_json['cases']:
            TestExamples.objects.create(
                tqID=tqID,
                cInput=case['input'],
                cOutput=case['output'],
                creator=creator,
            )
        
        response['status'] = 'ok'
        return HttpResponse(json.dumps(response), status=200)

    response['status'] = 'error'
    return HttpResponse(json.dumps(response), status=200)

