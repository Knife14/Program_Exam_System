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
    path('changeUser', views.change_user, name='changeUser'),
    path('changeMyself', views.change_myself, name='changeMyself'),
    path('addProblem', views.add_problem, name='addProblem'),
    path('testProgram', views.test_program, name='testProgram'),
]