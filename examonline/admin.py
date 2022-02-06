from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(UserInfo)
admin.site.register(TestQuestions)
admin.site.register(AnswerExamples)
admin.site.register(TestExamples)
admin.site.register(ExamInfo)
admin.site.register(StuExamEvent)
admin.site.register(StuExamSubmit)
