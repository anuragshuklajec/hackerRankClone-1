from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from .models import *
from django.core import serializers
import json
from django.views.decorators.csrf import csrf_exempt
from .utils import *  
import traceback


response_data = {
    "status": False,
    "message": ""
}
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Question

@csrf_exempt
def ManageQuestions(req):
    if req.method == "GET":
        res = Question.objects.all()
        jsonres = serializers.serialize("json", res)
        return JsonResponse(json.loads(jsonres), status=200, safe=False)
    
    if req.method == "POST":
        data = json.loads(req.body) 

        title = data.get('title', '')
        description = data.get('description', '')
        difficulty = data.get('difficulty', '')
        recommended_time = data.get('recommended_time', 0)
        starter_code = data.get("starterCode", "")
        
        if title and description and difficulty:
            new_question = Question.objects.create(title=title, description=description, difficulty=difficulty, recommended_time=recommended_time, starter_code=starter_code)    
            serialized_question = serializers.serialize('json', [new_question])
            return JsonResponse({"sucess": "true", "message": json.loads(serialized_question)[0]}, status=201)
        else:
            return JsonResponse({"sucess": "false", "message": "Invalid data. Please provide all required fields."}, status=400)

    return JsonResponse({"sucess": "false", "message": "Invalid request method"}, status=405)


@csrf_exempt 
def run(req):
    if req.method == "POST":
        try:
            data = json.loads(req.body)

            codePath = createFile()  
            with open(f"{codePath}.cpp", "w") as file:
                file.write(data["code"])   

            if data["arguments"]:
                with open(f"{codePath}.txt", "w") as file:
                    file.write(data["arguments"])

            result = runCode(codePath, data["arguments"])
            return JsonResponse(result) 
        except Exception as e:
            print("Exception:", e)       
            print(traceback.format_exc())                           
            response_data["message"] = str(e)
            return JsonResponse(response_data, status=500,  safe=True)
    


