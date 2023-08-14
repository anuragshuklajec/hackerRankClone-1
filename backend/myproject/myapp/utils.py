import os
import subprocess
import uuid
import json
from django.core import serializers




def createFile():
    curdir = os.path.dirname(__file__)
    folder =  os.path.join(curdir, "temp")
    if not os.path.exists(folder) :
        os.makedirs(folder)
    return os.path.join(folder, f"{uuid.uuid1()}")

def runCode(path, arguments, test):
    directory = os.path.dirname(path)
    fileNameWithoutExtension = os.path.basename(path)
    docker_command = [
        "docker",
        "run",
        "--rm",
        "-v",
        f"{directory}:/code",
        "cppimg",  # cpp image name
        "sh", "-c",
        f"g++ /code/{fileNameWithoutExtension}.cpp -o /code/{fileNameWithoutExtension}.out && /code/{fileNameWithoutExtension}.out ",
    ]
    if arguments:
        docker_command[-1] += f"< /code/{fileNameWithoutExtension}.txt"
    
    process = subprocess.Popen(docker_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    stdout, stderr = process.communicate()
    
    expectedInput = test.expected_output.strip()
    res = {"error": None, "output": None, "success": False, "test": json.loads(serializers.serialize("json", [test]))[0]["fields"]}
    if stderr:
        res["error"] = stderr
    else:
        res["output"] = stdout
        if(stdout.strip() == expectedInput):
            res["success"] = True
        else:
             res["success"] = False
        

    os.remove(f"{path}.cpp")
    if os.path.exists(f"{path}.out"):
        os.remove(f"{path}.out")
    if os.path.exists(f"{path}.txt"):
        os.remove(f"{path}.txt")

    return res
