
import json,os,math,random,uuid
from django.core import serializers
from myapp.models import Clients
from django.forms.models import model_to_dict
from django.contrib.auth.hashers import make_password, check_password
from datetime import datetime
from django.contrib.sessions.models import Session 
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync



def createUser(data):
    password = make_password(data.get('password'))       
    new_client =  Clients(
        isAdmin = data.get('isAdmin',False),
        password=password,
        firstname=data.get('firstName'),
        lastname=data.get('lastName'),
        email=data.get('email')
    )
    new_client.save()
    resultset = model_to_dict(new_client)
    resultset.pop("password")
    return resultset
    
# def updateUser(request):
#     data = json.loads(request.body)
#     resultset =  Clients.objects.get(email=data.get('email'))   
#     Clients.objects.filter(email=data.get('email')).update(
              
#         firstname = data.get('firstname',resultset.firstname),
#         lastname = data.get('lastname',resultset.lastname),
#         email = data.get('emailid',resultset.email),
#         mobileno = data.get('phonenumber',resultset.mobileno),
#         isdisabled = data.get('isdisabled',resultset.isdisabled),
#         address = data.get('address',resultset.address),
#         city = data.get('city',resultset.city) , 
#         country = data.get('country',resultset.country),
#         state = data.get('state',resultset.state) ,
#         pincode = data.get('pincode',resultset.pincode)
#     )
#     updatedUser = Clients.objects.get(clientid = data.get('clientid'))
#     result = model_to_dict(updatedUser)
#     result.pop("password", None)
#     result.pop("otp", None)
#     return result


# TO CHECK IF THE ACCOUNT IS DISABLED OR NOT
def isAccountDisabled(email):
    try:   
        resultset = Clients.objects.get(email=email)
        return resultset.isdisabled
    except Exception as e:
        raise Exception("User doesn't exist!!")

def checkPassword(dbpass, bodypass):
    if check_password(bodypass, dbpass) :      
        return True
    else :
        return False

def isSessionActive(email):  
    s = Session.objects.all()
    for session in s :
        try :           
            if str(session.get_decoded()['email']).lower() ==  email.lower():
                print(session.get_decoded())              
                return True  
        except Exception as e :
            pass
            # print("session active =========   >>>> ",e)
    return False

def createSession(request ,dbuser):
    request.session.clear_expired()

    request.session['sessionID'] = str(uuid.uuid1())       
    request.session['email'] = dbuser.email
    request.session['ID'] = dbuser.id
    request.session['isAdmin']=dbuser.isAdmin
    # request.session.set_expiry(28800) 

def sendURLInfo():
    
    try :     
        return json.load(open(f"{os.getcwd()}/configFiles/URL_List.json") )
    except Exception as e :
        print(e)

def getUsersProfile(dbuser):     
        user_data = model_to_dict(dbuser)
        user_data.pop("password")
        return user_data

def logout(request):
    try:
        request.session.set_expiry(0)       
        del request.session['sessionID']
        del request.session['email']
        del request.session['isAdmin']
        del request.session['ID']
        
    except Exception as e:
        # print(e)
        pass

def delRemoteSession(email):
    s = Session.objects.all()
    for session in s :
        try:
            if str(session.get_decoded()['email']).lower() ==  str(email).lower():
                Session.objects.filter(session_key=session.session_key).delete()

                try :
                    channel_layer = get_channel_layer()
                    async_to_sync(channel_layer.group_send)(str(session.get_decoded()['ID']), 
                                                            {"type": f"force_disconnect",
                                                             "result":{"ID":str(session.get_decoded()['ID'])}})
                except :
                    pass

                return True
        except :
            pass
    return False