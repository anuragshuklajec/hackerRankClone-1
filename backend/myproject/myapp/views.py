from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from .models import *
from django.core import serializers
import json
from django.views.decorators.csrf import csrf_exempt
from .utils import *  
import traceback
from django.forms.models import model_to_dict


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
        data = json.loads(req.body)

        question_id = data.get("questionId")
        tests = data.get("tests")

        testsLength = len(tests)
        if question_id is not None and testsLength > 0:
            try:
                question = Question.objects.get(pk=question_id)
                for test in tests:
                    TestCase.objects.create(question=question, input_data=test["input"], expected_output=test["output"], score=test["score"], name=test["name"])   
                return JsonResponse({"success": True, "message": f"{testsLength} Test case created successfully"}, status=200)
            except Question.DoesNotExist:
                return JsonResponse({"success": False, "message": "Question does not exist"}, status=400)
        else:
            return JsonResponse({"success": False, "message": "Invalid data. Please provide all required fields."}, status=400)
        
    return JsonResponse({"success": False, "message": "Invalid request method"}, status=405)

@csrf_exempt 
def run(req):
    if req.method == "POST":
        response = {"success": True, "message": None}
        try:
            data = json.loads(req.body)
            if not data["questionId"]:
                return JsonResponse({"success": False, "message": "Please provde a question"}, status=405)
            
            question = Question.objects.get(pk = data["questionId"])
            tests = TestCase.objects.filter(question=question)

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
                    testResults.append(res)
                    response["message"] = testResults
                
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
                data = Test.objects.filter(pk=id).values().first()
            else:
                data = list(Test.objects.all().values())

            return JsonResponse({"result": data, "success": True}, status=200)
            
        except Exception as e:
            print("Test get", e)
            return JsonResponse({"message": "Internal server error"}, status=500)

    

@csrf_exempt
def addQuestionToTest(request):
    msg = {"message": "", "success": False}
    if request.method == "POST":
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