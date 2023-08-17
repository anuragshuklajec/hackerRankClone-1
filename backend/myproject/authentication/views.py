from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from myapp.models import *
from django.core import serializers
import json
from django.views.decorators.csrf import csrf_exempt
from .utils import *  
import traceback
import time,json,logging
from rest_framework import status
from authentication.decorators import checkSession,admin_required
from django.db import IntegrityError
from django.forms.models import model_to_dict
from django.core.exceptions import *





@csrf_exempt 
def register(request):
    msg={"success": False, "message": ""}

    if request.method == "POST":        
        data = json.loads(request.body) 
        try : 
            resultset = createUser(data)
            msg["success"]=True
            msg["message"]=resultset  
            return JsonResponse(data=msg,safe=False,status=200)
        except ValidationError as e:
            missing_fields = [field for field, error_list in e.message_dict.items() if 'This field is required.' in error_list]
            if missing_fields:
                msg["message"] = f"Missing required fields: {', '.join(missing_fields)}."
            else:
                msg["message"] = "Validation error occurred."
            return JsonResponse(data=msg, safe=False, status=400)
        except Exception as e :   
            msg["message"]=str(e)
            return JsonResponse(data=msg,safe=False,status=500)
        

def getAllUsers(request):
    msg={"success": False, "message": ""}
    if request.method == "GET":
        try : 
            data = Clients.objects.all().values('isAdmin', 'firstname', 'lastname', 'email', 'isdisabled', 'createddate', 'updatedate')
            return JsonResponse(list(data),safe=False,status=200)    
        except Exception as e :
            msg["message"]=str(e)
            return JsonResponse(msg,safe=False,status=500)
        
# def deleteSession(request):
#     msg={"success": False, "message": ""}
#     if request.method=="GET" :
#         if delRemoteSession(body.get('data').get('email')) :
#             msg["status"]=True   
#             msg["message"]="Succefully logged out from another machin"                      
#             return JsonResponse(msg,safe=False,status=200)

@csrf_exempt
def auth(request):
    msg={"success": False, "message": ""}

    if request.method=="POST" :
        try:
            body = json.loads(request.body)  

            if len(body)<0 :
                msg["message"]="recieved blank body!!"
                return JsonResponse(msg,safe=False,status=500)

            dbuser = Clients.objects.get(email=body.get("email"))
            request.session.clear_expired()

            if dbuser.isdisabled:
                msg["message"]="Your account is disabled !! Contact your administrator!"
                return JsonResponse(msg,safe=False,status=403)

            if 'email' in request.session.keys() : 
                msg["message"]="You are already logged in!!"
                return JsonResponse(msg,safe=False,status=409)

            result = checkPassword(dbuser.password, body.get('password'))
        
            if not result:
                msg["message"]="Invalid password. Check your credentials and attempt login again."
                return JsonResponse(msg,safe=False,status=403)
            
            # if isSessionActive(dbuser.email) :
            #     msg["message"]="User is already Logged in on another machin!!"
            #     return JsonResponse(msg,safe=False,status=409)
            
            createSession(request, dbuser)
            msg["success"]=True      
            msg["message"]=getUsersProfile(dbuser)
            return JsonResponse(msg,safe=False,status=200)

        except ObjectDoesNotExist as e:
            print("DDDDD", e)
            msg["message"]="User with this email dosen't edits!!"   
            return JsonResponse(msg,safe=False,status=404)
        except Exception as e:
            print(e)
            msg["message"]=str(e)
            return JsonResponse(msg,safe=False,status=500)
        
    if request.method=="DELETE" :
        try:
            logout(request)
            msg["success"]=True       
            msg["message"]="user logged out!"
            return JsonResponse(msg,safe=False,status=200)
        except Exception as e:
            logout(request)
            msg["success"]=False  
            msg["message"]="user logged out!"
            return JsonResponse(msg,safe=False,status=500)

    if request.method=="GET" :
        try:
            if checkSession(request) :                 
                msg["status"]=True
            else :
                msg["status"]=False
                return JsonResponse(msg,safe=False,status=401)
        except Exception as e:
            msg["status"]=False
            msg["message"]=str(e)
            return JsonResponse(msg,safe=False,status=500)
       
    return JsonResponse(msg,safe=False,status=500)


@csrf_exempt
@admin_required
def dummyFunction(request):
    msg={"status":"","errorCode":"","message":"","result":"","transactionID":0,"redirectURL":"","httpStatus":status.HTTP_200_OK}
    msg['transactionID']=time.time()
    if request.method == 'POST':
        msg["status"]="success"
        msg["result"]="Hurray you are admin"
        msg["httpStatus"]=200
        return JsonResponse(msg,safe=False,status=msg["httpStatus"])