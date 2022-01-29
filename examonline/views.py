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

        if currentUSER['password'] == password and not currentUSER['is_online']:
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
        all_problems = list(TestQuestions.objects.filter().values())

        # 数据库日期类型不可被json转换
        response['data'] = list()
        for problem in all_problems:
            tmp = dict()

            tmp['proid'] = problem['tqID']
            tmp['name'] = problem['name']
            tmp['tags'] = problem['tags']
            tmp['type'] = problem['tqType']
            tmp['creator'] = problem['creator']

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

    if UserInfo.objects.get(userID=userID).identify == 'admin' or \
        UserInfo.objects.get(userID=userID).identify == 'teacher':
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
url: /examonline/addTest
use: 用于创建考试
http: PUT
content: name / datetime(length == 2) / type(自由/综合) / tags && nums
'''
def add_test(request):
    pass


'''
url: /examonline/testProgram
use: 用于测试程序
http: post
content: 
'''
def test_program(request):
    assert request.method == 'POST'
    message = json.loads(request.body.decode('utf-8'))

    userID = '20184281'  # 后续改用token，获取个人id
    # 后续应该用 考试ID + 题目ID + 提交次数来命名文件
    filename = \
        str(timezone.now().year) + str(timezone.now().month).rjust(2, '0') + str(timezone.now().day).rjust(2, '0') \
            + str(timezone.now().hour + 8).rjust(2, '0') + str(timezone.now().minute).rjust(2, '0') 

    # 得先添加一个文件夹（可以在某场考试中，也可以在创建账户的时候，后面再说吧！）
    # 根据语言类别存放于不同的文件夹中，方便后续编译执行
    path = os.path.abspath('.')
    if message['type'] == 'Python':
        with open(path + '\\temp_program\\' + userID + '\\' + filename + '.py', 'w', encoding='utf-8' ) as file:
            file.write(message['code'])
        
        try:
            order = 'python .\\temp_program\\' + userID + '\\' + filename + '.py'  # 如有参数，还需设置
            # 命令行执行代码，并且获取输出
            (status, output) = subprocess.getstatusoutput(order)  # output: string

            if output == '3':
                # 返回
                response = dict()
                response['status'] = 'pass'
                response['content'] = '运行成功'

                return HttpResponse(json.dumps(response), status=200)
            else:
                # 返回
                response = dict()
                response['status'] = 'no pass'
                response['content'] = '输出错误'

                return HttpResponse(json.dumps(response), status=200)
        except:
            # 返回
            response = dict()
            response['status'] = 'no pass'
            response['content'] = '提交错误，请修改您的代码！'  # 更多异常信息

            return HttpResponse(json.dumps(response), status=200)
    elif message['type'] == 'C':
        with open(path + '\\temp_program\\' + userID + '\\' + filename + '.c', 'w', encoding='utf-8' ) as file:
            file.write(message['code'])

    # 返回
    response = dict()
    response['status'] = 'pass'
    response['content'] = '运行成功'

    return HttpResponse(json.dumps(response), status=200)