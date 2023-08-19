import React, {useEffect, useState} from 'react'
import Modal from '../../../Components/Modal'
import styled from "styled-components"
import { edit } from 'ace-builds'
import { publicRequest } from '../../../api'

const FormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    >div{
        width: 100%;
        display: flex;
        gap: 1rem;
        @media (max-width: 600px){
            flex-direction: column;
        }
    }
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

const DefaultData = {name: "", input_data: "", expected_output: "", score: ""}
function AddEditTests({isOpen, setIsOpen, tests, setTests, editIndex, setEditIndex, questionPk}) {
    const [formData, setFormData] = useState(DefaultData)

    useEffect(() => {
        if(isOpen === false) setFormData(DefaultData)
        if(editIndex === null) return 
        setFormData(tests[editIndex])
        console.log(tests[editIndex])
    },[isOpen, editIndex]) 

    const handleTestAdd = async (e, type) => {
        e.preventDefault()
        console.log(type)

        try {
            console.log({questionPk})
            const {data} = await publicRequest.post("/testCase", {tests : formData, questionId: questionPk})
            if(type ==="add"){
                setTests(p => [...p, data.res])
            } else if( type === "edit"){
                setTests(p => {
                    const newData = [...p]
                    newData[editIndex] = formData
                    return newData
                })
                setEditIndex(null)
            }
        } catch (error) {
            console.log(error)
        }

        setIsOpen(false)
        setFormData(DefaultData)

        
    }


    const handleChange = (e) => setFormData(p => ({...p, [e.target.name]: e.target.value}))

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={`${editIndex !== null ? "Update": "add"} Test`} >
            <FormWrapper onSubmit={e => handleTestAdd(e, editIndex !== null ? "edit": "add")} >
                <div>
                    <InputWrapper>
                        <label>Test name</label>
                        <input className='primaryInput' name='name' value={formData.name} onChange={handleChange} required />
                    </InputWrapper>
                    <InputWrapper>
                        <label>Score</label>
                        <input className='primaryInput' name='score' value={formData.score} onChange={handleChange} required />
                    </InputWrapper>
                </div>
                <div>
                    <InputWrapper>
                        <label>Input</label>
                        <textarea style={{resize: "vertical"}} className='primaryInput' name='input_data' value={formData.input_data} onChange={handleChange} required />
                    </InputWrapper>
                    <InputWrapper>
                        <label>Output</label>
                        <textarea style={{resize: "vertical"}} className='primaryInput' name='expected_output' value={formData.expected_output} onChange={handleChange} required />
                    </InputWrapper>
                </div>
                <button style={{border: "none"}}  className='primaryBtn'  >{editIndex !== null ? "Update": "add"}</button>
            </FormWrapper>
            
        </Modal>
    )
}

export default AddEditTests