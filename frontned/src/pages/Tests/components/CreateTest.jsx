import React, { useState } from 'react'
import Modal from '../../../Components/Modal'
import styled from "styled-components"
import testImg from "../../../assets/illustration/test.png"
import { InputWrapper } from '../../../shared/styled'
import { publicRequest } from "../../../api"

const RolesAvailabe = [
    "Software Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "Algorithm Developer",
    "Systems Analyst",
    "Backend Developer",
    "Frontend Developer",
    "DevOps Engineer",
    "Quality Assurance Engineer",
    "Research Scientist",
    "Computer Vision Engineer",
    "Natural Language Processing Engineer",
    "Cryptographer",
    "Quantitative Analyst",
    "Game Developer",
    "Compiler Engineer",
    "Embedded Systems Engineer",
  ];
  


const Container = styled.div`
    display: flex; 
    align-items: center;
    justify-content: center;
    @media (max-width: 600px) {
        padding: 1rem 0;
        flex-direction: column;
        flex-direction: column-reverse;
    }
`   
const ImgWrapper = styled.div`
    display: flex; 
    >img{
        width: 100%;
    }
`
const MainSection = styled.div`
    width: min(500px, 100%);
    height: max-content;
`


function CreateTest({isOpen, setIsOpen, setTests}) {
  const [FormData, setFormData] = useState({title: "", role: "", isPublic: "", duration: 0})
  const handleChange = (e) => setFormData(p => ({...p, [e.target.name]: e.target.value}))

  const handleSubmit = async () => {
    try {
        const {data} = await publicRequest.post("/test", {...FormData, isPublic: JSON.parse(FormData.isPublic)})
        setTests(p => [...p, data.result])
        setIsOpen(false)
    } catch (error) {
        console.log(error)
    }
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Create Test" >
        <Container>
            <MainSection>
                <InputWrapper>
                    <label>Test Name</label>
                    <input name="title" value={FormData.title} onChange={handleChange} className='primaryInput' placeholder='Please Enter Test name' />
                </InputWrapper>
                <InputWrapper>
                    <label>Role</label>
                    <select name="role" value={FormData.role} onChange={handleChange} className='primaryInput' placeholder='Please Enter Test name'>
                        {RolesAvailabe.map(e => <option key={e} >{e}</option>)}
                    </select>
                </InputWrapper>
                <InputWrapper>
                    <label>Test Duration (in min)</label>
                    <input name="duration" value={FormData.duration} onChange={handleChange} className='primaryInput' placeholder='Enter Test Duration' type="number" />
                </InputWrapper>
                <InputWrapper>
                    <label>Access</label>
                    <select name="isPublic" value={FormData.isPublic} onChange={handleChange}  className='primaryInput' >
                        <option value={false}>Private</option>
                        <option value={true}>Public</option>
                    </select>
                </InputWrapper>
                <button className='primaryBtn noBorder' onClick={handleSubmit} >Create Test</button>
            </MainSection>
            <ImgWrapper><img src={testImg} /></ImgWrapper>
        </Container>
    </Modal>
  )
}

export default CreateTest