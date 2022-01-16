from os import name
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('addUser/', views.add_user, name='addUser'),
    path('changeUser/', views.change_user, name='changeUser'),
    path('changeMyself/', views.change_myself, name='changeMyself'),
]