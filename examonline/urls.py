from os import name
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.login, name='login'),
    path('currentUser', views.current_user, name='currentUser'),
    path('addUser', views.add_user, name='addUser'),
    path('changeUser', views.change_user, name='changeUser'),
    path('changeMyself', views.change_myself, name='changeMyself'),
    path('getMessage', views.get_message, name='getMessage'),
    path('addProblem', views.add_problem, name='addProblem'),
    path('addProgram', views.add_program, name='addProgram'),
]