from os import name
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.login, name='login'),
    path('currentUser', views.current_user, name='currentUser'),
    path('outLogin', views.out_login, name='outLogin'),
    path('getUsers', views.get_users, name='getUsers'),
    path('addUser', views.add_user, name='addUser'),
    path('gettheUser', views.get_theUser, name='gettheUser'),
    path('changeUser', views.change_user, name='changeUser'),
    path('deleteUser', views.delete_user, name='deleteUser'),
    path('changeMyself', views.change_myself, name='changeMyself'),
    path('getProblems', views.get_problems, name='getProblems'),
    path('addProblem', views.add_problem, name='addProblem'),
    path('getthePro', views.get_thePro, name='getthePro'),
    path('deletePro', views.delete_pro, name='deletePro'),
    path('changePro', views.change_pro, name='changePro'),
    path('getExams', views.get_exams, name='getExams'),
    path('addExam', views.add_exam, name='addExam'),
    path('gettheExam', views.get_theExam, name='gettheExam'),
    path('changeExam', views.change_exam, name='changeExam'),
    path('deleteExam', views.delete_exam, name='deleteExam'),
    path('stuGetExam', views.stu_getExam, name='stuGetExam'),
    path('exitExam', views.exit_exam, name='exitExam'),
    path('sendAbnormal', views.send_abnormal, name='sendAbnormal'),
    path('testProgram', views.test_program, name='testProgram'),
    path('testFill', views.test_fill, name='testFill'),
    path('getScore', views.get_score, name='getScore'),
    path('Invigilation', views.invigilation, name='Invigilation'),
    path('getSubmits', views.get_submits, name='getSubmits'),
    path('getAbnormals', views.get_abnormals, name='getAbnormals'),
    path('getRecords', views.get_records, name='getRecords'),
    path('getRecord', views.get_record, name='getRecord'),
    path('deleteRecord', views.delete_record, name='deleteRecord'),
    path('stuGetPros', views.stu_getPros, name='stuGetPros'),
    path('stuAddPro', views.stu_addPro, name='stuAddPro'),
]