import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { generatecode } from '../../../utils/generateCode';
import { publicRequest } from '../../../api';
import CodeMirrorEditor from '../../../Components/CodeMirroeEditor';

const Container = styled.div`
    min-height: 600px;
    padding: 2rem 1rem;
    display: flex;
    gap: 1.5rem;

    >*{
      width: 50%;
    }
`


const MainSection = styled.div`
`
const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    label{
      display: block;
      line-height: 30px;
      font-weight: 600;
      font-size: 14px;
    }
    >div{
      display: flex;
      align-items: center;
      gap: 1rem;
    }
`
const Parameters = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    >div{
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      width: 100%;
      margin-left: 1rem;
    }
`

const BtnWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`

const returntypes = [
  { key: "int", text: "int (integer)" },
  { key: "double", text: "double (floating-point number)" },
  { key: "char", text: "char (character)" },
  { key: "void", text: "void (no return value)" },
  { key: "bool", text: "bool (boolean)" },
  { key: "long", text: "long (long integer)" },
  { key: "unsigned int", text: "unsigned int (unsigned integer)" }
];

const DataTypes = [
  { key: "int", text: "INTEGER" },
  { key: "string", text: "STRING" },
  { key: "long", text: "LONG INTEGER" },
  { key: "float", text: "FLOAT" },
  { key: "double", text: "DOUBLE" },
  { key: "char", text: "CHARACTER" },
  { key: "bool", text: "BOOLEAN" },
  { key: "int[]", text: "INTEGER ARRAY" },
  { key: "string[]", text: "STRING ARRAY" },
  { key: "long[]", text: "LONG INTEGER ARRAY" },
  { key: "float[]", text: "FLOAT ARRAY" },
  { key: "double[]", text: "DOUBLE ARRAY" },
  { key: "char[]", text: "CHARACTER ARRAY" },
  { key: "bool[]", text: "BOOLEAN ARRAY" },
  { key: "int[][]", text: "INTEGER 2D ARRAY" },
  { key: "string[][]", text: "STRING 2D ARRAY" },
  { key: "long[][]", text: "LONG INTEGER 2D ARRAY" },
  { key: "float[][]", text: "FLOAT 2D ARRAY" },
  { key: "double[][]", text: "DOUBLE 2D ARRAY" },
  { key: "char[][]", text: "CHARACTER 2D ARRAY" },
  { key: "bool[][]", text: "BOOLEAN 2D ARRAY" },
  { key: "Node<int>", text: "INTEGER SINGLY LINKED LIST" },
  { key: "Node<string>", text: "STRING SINGLY LINKED LIST" },
  { key: "Node<long>", text: "LONG INTEGER SINGLY LINKED LIST" },
  { key: "Node<float>", text: "FLOAT SINGLY LINKED LIST" },
  { key: "Node<double>", text: "DOUBLE SINGLY LINKED LIST" },
  { key: "Node<char>", text: "CHARACTER SINGLY LINKED LIST" },
  { key: "Node<bool>", text: "BOOLEAN SINGLY LINKED LIST" },
  { key: "DoublyNode<int>", text: "INTEGER DOUBLY LINKED LIST" },
  { key: "DoublyNode<string>", text: "STRING DOUBLY LINKED LIST" },
  { key: "DoublyNode<long>", text: "LONG INTEGER DOUBLY LINKED LIST" },
  { key: "DoublyNode<float>", text: "FLOAT DOUBLY LINKED LIST" },
  { key: "DoublyNode<double>", text: "DOUBLE DOUBLY LINKED LIST" },
  { key: "DoublyNode<char>", text: "CHARACTER DOUBLY LINKED LIST" },
  { key: "DoublyNode<bool>", text: "BOOLEAN DOUBLY LINKED LIST" },
  { key: "Graph<int>", text: "UNWEIGHTED INTEGER GRAPH" },
  { key: "WeightedGraph<int>", text: "WEIGHTED INTEGER GRAPH" },
];


const boilerPlate = "#include <iostream>\nusing namespace std;\n\nint test() {\n  //Write your logic here\n}"
function CodeBluePrint({formData, set, setFormData, setQuestionPk}) {
  console.log({formData})
  const [returntype, setReturnType] = useState(returntypes[0].key)
  const [parameters , setParameters ] = useState([])

  const handleParamChange = (e, index) => {
    setParameters(p => {
      const newData = [...p];
      newData[index] = {...newData[index], [e.target.name]: e.target.value}
      return newData
    })
  }

  const handleParamAdd = () => {
    setParameters(p => [...p, {type: "int", name: ""}])
  }

  const handleGenerateCode = () => {
    const code = generatecode(returntype, parameters, boilerPlate)
    setFormData(p => ({...p, starterCode: code}))
  }

  const handleSubmit = async () => {
    console.log({formData})
    try {
        const {data} = await publicRequest.post("/questions", {...formData, parameters})
        if(data.sucess !== true) return 
        setQuestionPk(data.message.pk)
        set(p => p+1)
    } catch (error) {
        console.log(error)
    }
}
  return (
    <>
    <Container>
      <MainSection className='well' >
        <div>
          <InputWrapper>
            <label>Function Retun Type</label>
            <select className='primaryInput' onChange={e => setReturnType(e.target.value)} >
              {returntypes.map(e => <option value={e.key} >{e.text}</option>)}
            </select>
          </InputWrapper>
          <InputWrapper>
            <div><label>Function Retun Type</label> <button onClick={handleParamAdd} className='btnSmall' >Add</button></div>
            <Parameters>
              {parameters.map((e, i) => {
                return <div> 
                    <select className='primaryInput' name='type' onChange={e => handleParamChange(e, i)}  >
                      {DataTypes.map(e => <option value={e.key} >{e.text}</option>)}
                    </select>
                    <input className='primaryInput' placeholder='name'  value={parameters[i].name} name='name' onChange={e => handleParamChange(e, i)}  />
                </div>
              })}      
            </Parameters>
          </InputWrapper>
        </div>
        <button onClick={handleGenerateCode} className='btnSmall'  >Generate Code</button>
      </MainSection>
      <CodeMirrorEditor code={formData.starterCode} setcode={e => setFormData(p => ({...p, starterCode: e}))} />
    </Container>
    <BtnWrapper>
        <button className='primaryBtn' onClick={handleSubmit} >Save Question & Proceed</button>
    </BtnWrapper>
    </>
  )
}

export default CodeBluePrint