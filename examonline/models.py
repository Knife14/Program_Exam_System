from django.db import models
from django.db.models.expressions import F
from django.db.models.fields import TextField

# Create your models here.

# 用户信息表
class UserInfo(models.Model):
    identify = models.CharField(max_length=10, blank=False)  # 非空，使用者身份，三种：teacher、student、admin
    userID = models.CharField(max_length=11, blank=False, unique=True)  # 非空且唯一，ID，不可变
                                                                        # 学生：年份 - xxxx，教师： 年份 - 学院（xxx） - xxx 管理员： 1900 - xxxx
    password = models.CharField(max_length=100, blank=False)  # 密码，非空
    name = models.CharField(max_length=30, blank=False)  # 姓名，非空
    college = models.CharField(max_length=20)  # 学院
    major = models.CharField(max_length=20)  # 专业
    telephone = models.CharField(max_length=15)  # 电话
    email = models.EmailField(max_length=100)  # 邮箱
    addtime = models.DateTimeField(auto_now_add=True)  # 记录第一次入库的时间
    changetime = models.DateTimeField(auto_now=True)  # 修改记录的时间

# 试题表： 针对编程题，本应还有内存限制，但鉴于技术水平限制，暂时舍弃
class TestQuestions(models.Model):
    tqID = models.CharField(max_length=16, blank=False, unique=True)  # 试题ID，非空且唯一：年月日时分（12） - xx
    tqType = models.CharField(max_length=5, blank=False)  # 试题类型，非空：暂时是填空、编码题
    name = models.CharField(max_length=100, blank=False)  # 试题名称，非空
    tags = models.CharField(max_length=100)  # 试题标签：算法、动态规划、数据结构、BFS、DFS等，以;号间隔
    content = models.CharField(max_length=5000, blank=False)  # 试题内容，不定长，非空
    answer = models.TextField()  # 试题答案，仅填空题可能有，不定长
    inputnums = models.CharField(max_length=5000)  # 试题需要填充的代码段数，仅填空题有
    limit = models.CharField(max_length=100)  # 限制条件，一般仅为运行时间（ms）和运行内存（MB），目前只支持运行时间
    creator = models.CharField(max_length=11, blank=False)  # 试题创造者ID，非空：以确保除管理员外，只有本人才可修改本人编辑的题目?
    aqtimes = models.IntegerField(default=0)  # 出题次数，默认为0
    addtime = models.DateTimeField(auto_now_add=True)  # 记录第一次入库的时间
    changetime = models.DateTimeField(auto_now=True)  # 修改记录的时间
    is_audited = models.IntegerField(default=0)  # 是否已经审核，用于区分学生提交的新试题： 0 - 待审核， 1 - 已通过， 2 - 未通过
    difficulty = models.CharField(max_length=10)  # 试题难度
    courses = models.CharField(max_length=30)  # 所属课程

# 示例表： 一个试题可以有多个不同的示例，一条示例即为一项纪录
class AnswerExamples(models.Model):
    tqID = models.CharField(max_length=14, blank=False)  # 对应试题ID，非空
    cInput = models.TextField()  # 输入，以list形式存储，一个元素即为一个参数
    cOutput = models.TextField()  # 输出，以list形式存储，一个元素即为一个参数
    creator = models.CharField(max_length=11, blank=False)  # 示例创造者ID，非空
    addtime = models.DateTimeField(auto_now_add=True)  # 记录第一次入库的时间
    changetime = models.DateTimeField(auto_now=True)  # 修改记录的时间

# 测试用例表：一个试题可以有多个不同的测试用例，一条测试用例即为一项记录
class TestExamples(models.Model):
    tqID = models.CharField(max_length=14, blank=False)  # 对应试题ID，非空
    cInput = models.TextField()  # 输入，以list形式存储，一个元素即为一个参数
    cOutput = models.TextField()  # 输出，以list形式存储，一个元素即为一个参数
    creator = models.CharField(max_length=11, blank=False)  # 测试用例创造者ID，非空
    addtime = models.DateTimeField(auto_now_add=True)  # 记录第一次入库的时间
    changetime = models.DateTimeField(auto_now=True)  # 修改记录的时间

# 考试表：记录考试场次
class ExamInfo(models.Model):
    examID = models.CharField(max_length=13, blank=False, unique=True)  # 当场考试ID，非空且唯一：年月日 - xxxx
    name = models.CharField(max_length=100, blank=False)  # 考试名称，非空
    startTime = models.DateTimeField(blank=False)  # 考试开始时间，非空
    endTime = models.DateTimeField(blank=False)  # 考试截止时间，非空
    duraTime = models.IntegerField(blank=False)  # 考试持续时间，非空：单位为分钟
    eqlist = models.CharField(max_length=100, blank=False)  # 考试题目列表，只保存试题ID以及对应分值，不保存具体内容
    creator = models.CharField(max_length=11, blank=False)  # 当场考试创造者ID，非空
    addtime = models.DateTimeField(auto_now_add=True)  # 记录第一次入库的时间
    changetime = models.DateTimeField(auto_now=True)  # 修改记录的时间
    course = models.CharField(max_length=30)  # 所属课程

# 学生参与考试情况表：仅保存进入、退出、异常记录
class StuExamEvent(models.Model):
    userID = models.CharField(max_length=11, blank=False)  # 学生ID，非空
    examID = models.CharField(max_length=13, blank=False)  # 考试场次ID，非空
    eventType = models.CharField(max_length=20, blank=False)  # 事件类型，非空：进入考试、退出考试、行为异常
    event = models.CharField(max_length=100)  # 事件发生内容，只用于异常记录
    addTime = models.DateTimeField(auto_now_add=True)  # 事件发生时间

# 学生考试提交记录：仅保存学生提交信息
class StuExamSubmit(models.Model):
    userID = models.CharField(max_length=11, blank=False)  # 学生ID，非空
    examID = models.CharField(max_length=13, blank=False)  # 考试场次ID，非空
    tqID = models.CharField(max_length=14, blank=False)  # 对应试题ID，非空
    content = models.TextField()  # 提交内容
    score = models.IntegerField()  # 该次提交所获分值，最终得分按照当场该题提交最高得分计算
    addTime = models.DateTimeField(auto_now_add=True)  # 提交时间