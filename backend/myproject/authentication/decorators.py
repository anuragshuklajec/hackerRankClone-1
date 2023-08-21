from functools import wraps
import time
from django.contrib.sessions.models import Session 
from django.http import JsonResponse


def checkSession(func):
    @wraps(func)  # used for copying func metadata
    def wrapper(*args, **kwargs):
        msg= {"success": False, "message": None}

        args[0].session.clear_expired() 
        
        if 'ID' not in args[0].session.keys() :  
            msg["message"]="Unauthorized. Please login or register first!!!"
            return JsonResponse(msg,safe=False)
        else :  
            try :
                s = Session.objects.get(pk=args[0].session.session_key)   
                    
                if len(s.get_decoded().keys())>0:
                    result = func(*args, **kwargs)
                    return result
                else :
                    msg["message"]="Unauthorized. Please login or register first!!!"
                    return JsonResponse(msg,safe=False)  

            except Exception as e :
                print(e)
                msg["message"]="Unauthorized. Please login or register first!!!"
                return JsonResponse(msg,safe=False)               
                               
    return wrapper



def admin_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        msg={"status":"","errorCode":"","reason":"","result":"","transactionID":0,"redirectURL":""}
        msg['transactionID']=time.time()
        if request.session.get('isAdmin', False):
            return view_func(request, *args, **kwargs)
        else:
            msg["status"]="error"
            msg["reason"]="Unauthorized. Please login or register first!!!"
            msg["errorCode"]=101 
            return JsonResponse(data=msg,safe=False)  
    return _wrapped_view

