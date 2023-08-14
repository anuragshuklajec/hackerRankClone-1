import React, {useState} from 'react'
import Modal from '../../../Components/Modal'
import styled from "styled-components"

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

function AddEditTests({isOpen, setIsOpen, tests, setTests}) {
    const [formData, setFormData] = useState({name: "", input: "", output: "", score: ""})

    const handleTestAdd = (e) => {
        e.preventDefault()
        setTests(p => [...p, formData])
        setIsOpen(false)
    }


    const handleChange = (e) => setFormData(p => ({...p, [e.target.name]: e.target.value}))

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Test modal" >
            <FormWrapper onSubmit={handleTestAdd} >
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
                        <textarea style={{resize: "vertical"}} className='primaryInput' name='input' value={formData.input} onChange={handleChange} required />
                    </InputWrapper>
                    <InputWrapper>
                        <label>Output</label>
                        <textarea style={{resize: "vertical"}} className='primaryInput' name='output' value={formData.output} onChange={handleChange} required />
                    </InputWrapper>
                </div>
                <button style={{border: "none"}}  className='primaryBtn' >Add</button>
            </FormWrapper>
            
        </Modal>
    )
}

export default AddEditTests