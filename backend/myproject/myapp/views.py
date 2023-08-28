from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from .models import *
from django.core import serializers
import json
from django.views.decorators.csrf import csrf_exempt
from .utils import *  
import traceback
from django.forms.models import model_to_dict
from django.db.models import Count
from authentication.decorators import *
import secrets
from django.core.mail import send_mail
from uuid import uuid4


response_data = {
    "status": False,
    "message": ""
}

@csrf_exempt
def ManageQuestions(req):
    if req.method == "GET":
        id = req.GET.get("id")
        testid = req.GET.get("test")

        if(id):
            res = Question.objects.get(pk = id)
            jsonres = serializers.serialize("json", [res])
            finalData = json.loads(jsonres)[0]
        elif(testid):
            test = Test.objects.get(id=testid)
            questions = test.questions.all()
            finalData = json.loads(serializers.serialize("json", questions))



        else:
            res = Question.objects.all()
            jsonres = serializers.serialize("json", res)
            finalData = json.loads(jsonres)



        return JsonResponse(finalData, status=200, safe=False)
    
    if req.method == "POST":
        data = json.loads(req.body) 

        title = data.get('title', '')
        description = data.get('description', '')
        difficulty = data.get('difficulty', '')
        recommended_time = data.get('recommended_time', 0)
        starter_code = data.get("starterCode", "")
        inputs = data.get("parameters", [])

        if title and description and difficulty and starter_code and inputs:
            new_question = Question.objects.create(title=title, description=description, difficulty=difficulty, recommended_time=recommended_time, starter_code=starter_code, inputs=inputs)    
            serialized_question = serializers.serialize('json', [new_question])
            return JsonResponse({"sucess": True, "message": json.loads(serialized_question)[0]}, status=201)
        else:
            return JsonResponse({"sucess": False, "message": "Invalid data. Please provide all required fields."}, status=400)

    return JsonResponse({"sucess": False, "message": "Invalid request method"}, status=405)

@csrf_exempt
def ManageTestCases(req):
    
    if req.method == "POST":
        res = response_data
        data = json.loads(req.body)

        question_id = data.get("questionId")
        test = data.get("tests")

        if question_id is None:
            return JsonResponse({"success": False, "message": "Invalid data. Please provide all required fields."}, status=400)
        
        try:
            question = Question.objects.get(pk=question_id)
            test_id = test.get("id")

            if not test_id: #if we dont have and id in test object then we create test or update test for that id
                savedTest = TestCase.objects.create(question=question, input_data=test["input_data"], expected_output=test["expected_output"], score=test["score"], name=test["name"]) 
                res["message"] = "Test case created successfully"
            else:
                savedTest = TestCase.objects.get(pk=test_id, question=question)
                savedTest.input_data = test["input_data"]
                savedTest.expected_output = test["expected_output"]
                savedTest.score = test["score"]
                savedTest.name = test["name"]
                savedTest.save()  
                res["message"] = "Test case updated successfully"
            
            res["status"] = True
            res["res"] = model_to_dict(savedTest)
            return JsonResponse(res, status=200)
        except Question.DoesNotExist:
            res["message"] = "Question does not exist"
            return JsonResponse(res, status=400)
        
    if req.method == "DELETE":
        res = response_data

        test_id = req.GET.get("id")

        if not test_id:
            res["message"] = "Please provide a test id to delete it"
            return JsonResponse(res, status=400)

        try:
            test_case = TestCase.objects.get(pk=test_id)
            test_name = test_case.name 
            test_case.delete()
            res["message"] = f"{test_name} test deleted successfully!!"
            res["status"] = True
            return JsonResponse(res, status=200)
        
        except TestCase.DoesNotExist:
            res["message"] = "Test case does not exist"
            return JsonResponse(res, status=404)
        except Exception as e:
            print(e)
            res["message"] = "Internal server error"
            return JsonResponse(res, status=500)


            
            
        
    return JsonResponse({"success": False, "message": "Invalid request method"}, status=405)

@csrf_exempt 
@checkSession
def run(req):
    if req.method == "POST":
        response = {"success": True, "message": None}
        try:
            data = json.loads(req.body)
            if not data["questionId"]:
                return JsonResponse({"success": False, "message": "Please provde a question"}, status=405)
            
            question = Question.objects.get(pk = data["questionId"])
            tests = TestCase.objects.filter(question=question)

            totalScore = 0

            testResults = []
            for test in tests:
                codePath = createFile()  
                with open(f"{codePath}.cpp", "w") as file:
                    file.write(data["code"])   

                elements =  test.input_data.split(",") 
                stripped_elements = [element.strip() for element in elements] 
                joined_input = "\n".join(stripped_elements)

                if joined_input:
                    with open(f"{codePath}.txt", "w") as file:
                        file.write(joined_input)

                res = runCode(codePath, joined_input, test)
                if res["compiled"] is False:
                    response["success"] = False
                    response["message"] = {
                        "compiled": False,
                        "error": res["error"]
                    }
                    break
                else:
                    if(res["success"]):
                        totalScore = totalScore + int(test.score)
                    
                    testResults.append(res)
                    response["message"] = testResults

            if(response["success"]):
                user = Clients.objects.get(pk = req.session.get("ID"))
                QuestionAttempt.objects.create(
                    user = user,
                    question = question,
                    result = totalScore,
                )
                testid = data.get('testid',None)
                if testid:
                    test = test.objects.filter(pk = testid)
                    if not test : 
                        response["success"] = False
                        response["message"] = "Test not found"
                        return JsonResponse(response, status=404)
                    
                    testInvitation = TestInvitation.objects.filter(test=test,client_email = user.email)
                    if not testInvitation:
                        response["success"] = False
                        response["message"] = "Prohibted"
                        return JsonResponse(response, status=404)

                    testAttempt = TestAttempt.objects.update_or_create(test=test,user=user)
                    testAttempt.score += totalScore
                    testAttempt.save()
                    response["success"] = True
                    return JsonResponse(response, status=200)


            return JsonResponse(response, status=200)
        except Exception as e:
            print("Exception:", e)       
            print(traceback.format_exc())                           
            response_data["message"] = str(e)
            return JsonResponse(response_data, status=500,  safe=True)
        

@csrf_exempt
def ManageTests(req):
    msg = {"message": "", "success": False}
    if req.method == "POST":
        body = json.loads(req.body)
        try:
            savedData = Test.objects.create(
                title = body["title"],
                role = body["role"],
                public= body["isPublic"],
                duration = body["duration"]
            )
            msg["message"] = "Test Added successfully"
            msg["result"] = model_to_dict(savedData)
            msg["success"] = True
            return JsonResponse(msg, status = 200)
        except Exception as e:
            print(e)
            msg["message"] = "Internal server error"
            return JsonResponse(msg, status = 500)
        
    if req.method == "GET":
        try:
            id = req.GET.get("id")
            if id:
                print("id", id)
                data = Test.objects.filter(pk=id).annotate(question_length=models.Count('questions')).values().first()
                data['questionLength'] = data.pop('question_length')
            else:
                data = list(Test.objects.annotate(num_questions=Count('questions')).values())

            return JsonResponse({"result": data, "success": True}, status=200)
            
        except Exception as e:
            print("Test get", e)
            return JsonResponse({"message": "Internal server error"}, status=500)

    

@csrf_exempt
def manageTestQuestions(request):
    if request.method == "DELETE":
        msg = {"message": "", "success": False}
        try:
            testid = request.GET.get('testid')
            questionid = request.GET.get('qid')

            test = Test.objects.get(pk=testid)
            question = test.questions.get(pk=questionid)
            test.questions.remove(question)
            msg["message"] = "Question deleted successfully"
            msg["success"] = True
            return HttpResponse("Question deleted successfully", status=200)
            
        except Test.DoesNotExist:
            msg["message"] = "Tst not found"
            return HttpResponse(msg, status=404)
            
        except Question.DoesNotExist:
            msg["message"] = "Question not found"
            return HttpResponse(msg, status=404)
            
        except Exception as e:
            print(e)
            msg["message"] = "An error occured"
            return HttpResponse(msg, status=500)



    if request.method == "POST":
        msg = {"message": "", "success": False}
        try:
            body = json.loads(request.body)
            test_id = body.get('test')
            question_id = body.get('question')
            
            test = Test.objects.get(pk=test_id)
            question = Question.objects.get(pk=question_id)
            
            test.questions.add(question)   
            msg["message"] = "Question added to the test successfully."
            msg["success"] = True
            return JsonResponse(msg, status=200)
        except Test.DoesNotExist:
            msg["message"] = 'Test not found.'
            return JsonResponse(msg, status=404)
        except Question.DoesNotExist:
            msg["message"] = 'Question not found.'
            return JsonResponse(msg, status=404)
        except Exception as e:
            msg["message"] = str(e)
            return JsonResponse(msg, status=500)
    else:
        return JsonResponse({'message': 'Invalid request method.'}, status=400)

@csrf_exempt
def testInvitation(request):
    msg = {"message": "", "success": False}
    if request.method == "POST":
        try:
            __body = json.loads(request.body)
            test_id = __body.get('testid')
            client_email = __body.get('users')
            title = __body.get("title")
            desc = __body.get("desc")

            invitations = []
            test = Test.objects.get(pk = test_id)
            uniqueid = uuid4()
            for email in client_email:
                invitation = TestInvitation(test=test, client_email=email, token = uniqueid)
                invitations.append(invitation)
            
            TestInvitation.objects.bulk_create(invitations)

            reset_url = f"{request.META.get('HTTP_REFERER')}test/{test_id   }/{uniqueid}"  

            send_mail(
                subject = 'Test Invitation', 
                html_message = generateMail(test, title, desc, reset_url), 
                from_email = 'noreply.srhft@gmail.com', 
                recipient_list = client_email
            )

            msg["message"] = "Invitation sent successfully"
            msg["success"] = True
            return JsonResponse(msg, status=200)

        except Exception as e:
            msg["message"] = str(e)
            return JsonResponse(msg, status=404)
        
    elif request.method == 'GET':
        try:
            test_id = request.GET.get('testid')
            TestInvitation.objects.get(test=test_id,client_email=request.session['email'])
            msg["success"] = True
            return JsonResponse(msg, status=200)
        except TestInvitation.DoesNotExist:
            msg["success"] = False
            return JsonResponse(msg, status=404)
        except Exception as e:
            msg["success"] = False
            msg["message"] = str(e)
            return JsonResponse(msg, status=500)


@csrf_exempt
def testAttempt(request):
    msg = {"message": "", "success": False}
    if request.method == "POST":
        try:
            __body = json.loads(request.body)
            testId = __body.get('testId')
            email = __body.get('email')

            test = Test.objects.filter(pk = testId)
            if not test :
                msg["message"]  = "Test doesn't exists"
                return JsonResponse(msg,status=404)
            
            userInvited = TestInvitation.objects.filter(test=test,client_email = email)
            if not userInvited :
                msg["message"] = "Prohibted"
                return JsonResponse(msg, status=404)
            
            msg["success"] = True
            return JsonResponse(msg, status=404)
        except Exception as e:
            msg["message"] = str(e)
            return JsonResponse(msg, status=404)
            


                
                    

                        
 


                

        

