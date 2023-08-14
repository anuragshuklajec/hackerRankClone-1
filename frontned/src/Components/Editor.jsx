import React, { useRef, useState, useEffect } from "react";
import AceEditor from "react-ace";
import axios from "axios";
import "./editor.css"
import "ace-builds/src-noconflict/mode-python"
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import Spinner from "./Spinner";
import { styled } from "styled-components";

const Button = styled.button`
    display: flex;
    align-items: center;
    gap: 1rem;

    background-color: #f8b500;
    border: none;
    color: #fff;
    padding: 10px 20px;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    :disabled{
      background-color: #e7d39a !important;
    }
`

function formatTime(timeInSeconds) {
  const seconds = timeInSeconds % 60;
  const minutes = Math.floor((timeInSeconds / 60) % 60);
  const hours = Math.floor(timeInSeconds / 3600);

  return `${hours} hours, ${minutes} minutes, ${seconds.toFixed(2)} seconds`;
}




const Editor = () => {
  const editorRef = useRef(null);
  const [code, setcode] = useState(`#include <iostream>\nint main() {\n    std::cout << "Hello World!";\n    return 0;\n}`);
  const [argument, setArgument] = useState("[]")
  const [withTIme, setWithTime] = useState(false)
  const [response, setResponse] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (newValue) => {
    setcode(newValue);
  };

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.post(`http://localhost:8000/run`, {
        code,
        withTime: withTIme,
        arguments: argument.split(",").join("\n")
      });
      setResponse(data);
    } catch (error) {
      console.log(error)
      // setError("Internal server error");
    }
    setIsLoading(false)
  };

  return (
    <div className="container">
      <AceEditor
        ref={editorRef}
        width="100%"
        value={code}
        mode="c_cpp"
        theme="monokai"
        fontSize={14}
        showPrintMargin={true}
        enableBasicAutocompletion={true}
        enableLiveAutocompletion={true}
        showGutter={true}
        highlightActiveLine={true}
        onChange={handleChange}
        setOptions={{
          tabSize: 2,
          useWorker: false,
        }}
      />
      <br />
      With Time : <input type="checkbox" checked={withTIme} onChange={e =>setWithTime(e.target.checked)} /><br/>
      <br />
      Arguments : <input type="text" value={argument} onChange={e => setArgument(e.target.value)} /><br/><br />
      <br />
      <Button onClick={handleSubmit} disabled={isLoading}  >{isLoading ? <><Spinner size={20} /> Processing</> : "Submit" }</Button>
  

      {response && (
        <div className="response">
          {response.status ? (
            <div >
              <h1>Success</h1> {response.time && <small>Time Took : {+response.time} s </small>}
              <pre className="success message">{response.message}</pre>
            </div>
          ) : (
            <div >
              <h1>Failed</h1>
              <div className="failed message">
                <pre>{response.message}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Editor;
