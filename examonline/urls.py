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
    path('testProgram', views.test_program, name='testProgram'),
]