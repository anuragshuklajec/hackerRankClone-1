import os
import subprocess
import uuid




def createFile():
    curdir = os.path.dirname(__file__)
    folder =  os.path.join(curdir, "temp")
    if not os.path.exists(folder) :
        os.makedirs(folder)
    return os.path.join(folder, f"{uuid.uuid1()}")

def runCode(path, arguments):
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

    res = {"status": False, "message": None, "time": None}
    if stderr:
        res["message"] = stderr
    else:
        res["status"] = True
        res["message"] = stdout

    os.remove(f"{path}.cpp")
    if os.path.exists(f"{path}.out"):
        os.remove(f"{path}.out")
    if os.path.exists(f"{path}.txt"):
        os.remove(f"{path}.txt")

    return res
