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

const Editor = ({code, setcode}) => {
  const handleChange = (newValue) => {
    setcode(newValue);
  };



  return (
    <div className="container">
      <AceEditor
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
    </div>
  );
};

export default Editor;
