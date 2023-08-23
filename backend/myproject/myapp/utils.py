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
    res = {"error": None, "output": None, "success": False, "compiled": False, "test": json.loads(serializers.serialize("json", [test]))[0]["fields"]}

    if os.path.exists(f"{path}.out"): 
        res["compiled"] = True
        os.remove(f"{path}.out")

    if stderr:
        res["error"] = stderr
    else:
        res["output"] = stdout
        if(stdout.strip() == expectedInput):
            res["success"] = True
        else:
             res["success"] = False
        

    os.remove(f"{path}.cpp")
    if os.path.exists(f"{path}.txt"):
        os.remove(f"{path}.txt")

    return res


def generateMail(test, title, desc, redirect):
    return f"""
            <!DOCTYPE html>
            <html>
            <head>
            <style>
                *{{
                    color:black;
                }}
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                }}
                .list{{
                    background-color: #eee;
                    padding: 1rem;
                    border-radius: 0.5rem;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    margin-bottom: 20px;
                }}
                .button {{
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #fff !important ;
                    text-decoration: none;
                    border-radius: 5px;
                }}
            </style>
            </head>
            <body>

            <div class="container">
                <div class="header">
                    <h1>{title}</h1>
                </div>
                {desc}
                <h2>Test Details:</h2>
                <div class="list">
                    <p><strong>Duration:</strong> {test.duration}</p>
                    <p><strong>Starting Date:</strong> dummy</p>
                    <p><strong>End Login Date:</strong> dummy</p>
                </div>
                <p>Don't miss this opportunity to demonstrate your abilities. The test is designed to showcase your problem-solving skills and technical expertise.</p>
                <p><strong>Ready to Begin?</strong></p>
                <p>The test will be available for completion from dummy to dummy. Click the button below to start the test:</p>
                <p><a class="button" href="{redirect}">Start Test</a></p>
                <p>Thank you for considering this opportunity and for your commitment to joining our team. We look forward to reviewing your results.</p>
            </div>
            </body>
            </html>
            """