from django.urls import path

from .views import *


urlpatterns = [
    path('getAllUsers',getAllUsers), 
    path('createUser',register),
    path('login',auth),
    path('logout',auth),
    path('delSession',auth),
    path('dummyFunction',dummyFunction),

]
