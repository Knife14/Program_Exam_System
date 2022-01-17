from django.db import models
from django.db.models.expressions import F

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
    tqID = models.CharField(max_length=15, blank=False, unique=True)  # 试题ID，非空且唯一：年月日时分（12） - xx
    tqType = models.CharField(max_length=5, blank=False)  # 试题类型，非空：暂时是填空、编码题
    name = models.CharField(max_length=100, blank=False)  # 试题名称，非空
    tags = models.CharField(max_length=100)  # 试题标签：算法、动态规划、数据结构、BFS、DFS等，以;号间隔
    content = models.TextField()  # 试题内容，不定长
    answer = models.TextField()  # 试题答案，仅填空题可能有，不定长
    limitTime = models.IntegerField()  # 试题限制，仅编码题可能有，单位为毫秒(ms)
    creator = models.CharField(max_length=11, blank=False)  # 试题创造者ID，非空：以确保除管理员外，只有本人才可修改本人编辑的题目?
    addtime = models.DateTimeField(auto_now_add=True)  # 记录第一次入库的时间
    changetime = models.DateTimeField(auto_now=True)  # 修改记录的时间

# 示例表： 一个试题可以有多个不同的示例，一条示例即为一项纪录
class AnswerExamples(models.Model):
    tqID = models.CharField(max_length=14, blank=False, unique=True)  # 对应试题ID，非空且唯一
    cInput = models.TextField()  # 输入，以list形式存储，一个元素即为一个参数
    cOutput = models.TextField()  # 输出，以list形式存储，一个元素即为一个参数
    addtime = models.DateTimeField(auto_now_add=True)  # 记录第一次入库的时间
    changetime = models.DateTimeField(auto_now=True)  # 修改记录的时间

# 测试用例表：一个试题可以有多个不同的测试用例，一条测试用例即为一项记录
class TestExamples(models.Model):
    tqID = models.CharField(max_length=14, blank=False, unique=True)  # 对应试题ID，非空且唯一
    content = models.TextField()  # 测试用例具体内容，不定长，以list形式存储，一个元素即为一个参数
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

# 学生参与考试情况表：存储考试情况以及进行考后分析，一个学生参加一场考试即为一条记录
class StuExamSituation(models.Model):
    userID = models.CharField(max_length=11, blank=False)  # 学生ID，非空
    examID = models.CharField(max_length=13, blank=False)  # 考试场次ID，非空
    totalScore = models.IntegerField()  # 该场考试总成绩
    anoTimes = models.IntegerField()  # 该场考试异常情况次数：跳出屏幕、监测出摄像头异常等
    qSituation = models.TextField()  # 该场考试得分情况：用于考后成绩分析，以[tqid: 得分]形式保存
    time = models.DateTimeField(auto_now=True)  # 修改记录的时间