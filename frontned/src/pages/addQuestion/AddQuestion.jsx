import React, { useState } from 'react'
import { styled } from 'styled-components'
import ProblemStatement from './steps/ProblemStatement'
import TestCases from './steps/TestCases'
import CodeBluePrint from './steps/CodeBluePrint'

const Container = styled.div`
    min-height: 100vh;
    min-height: 100dvh;
`
const Title = styled.h1`
    margin: 1rem 0.5rem;
    font-size: 1.5rem;
    font-weight: 500;
`

const StepsNav = styled.div`
    height: 60px;
    user-select: none;
    display: flex;
    gap: 0.25rem;
    background-color: rgb(243 244 246/1);
    padding: 2px;
    border-radius: 0.375rem;
    overflow: hidden;
`
const SingleNav = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    border-radius: 0.375rem;
    padding: 0.5rem 1rem;
    color: ${p => p.isactive ? "rgb(31 41 55)" : " rgb(75 85 99)"};
    background-color: ${p => p.isactive ? "white" : "inherit"};
    ${p => p.isactive && "box-shadow: 0 0 #0000, 0 0 #0000,0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1);"};

    svg{
        color: ${p => p.isactive ? "rgb(31 41 55)" : " rgb(75 85 99)"};
        font-size: 1rem;
    }
    ${p => !p.isactive && " :hover{background-color: rgb(229 231 235/1);}" };
`

const MainSection = styled.div`


`

const Steps = [
    {title: "Problem Statement", component: ProblemStatement},
    {title: "Code Blueprint", component: CodeBluePrint },
    {title: "Test case", component: TestCases},
]

function AddQuestion() {
    const [questionPk, setQuestionPk] = useState(null)
    const [activeStep, setActiveStep] = useState(0)
    const [formData, setFormData] = useState({title: "", recommended_time: 0, difficulty: "Easy", description: "", starterCode: "#include <iostream>\nusing namespace std;\n\nint test() {\n  //Write your logic here\n}"})
    const ActiveComp = Steps[activeStep].component


    const handleNavClick = (index) => {
        if(activeStep < index) return 
        setActiveStep(index)
    }
  return (
    <Container>
        <Title>Create Question</Title>
        <StepsNav>
            {Steps.map((e, i) => {
                 return <SingleNav isactive={activeStep === i} key={e.title} onClick={() => handleNavClick(i)} >{e.title}</SingleNav>
            })}
        </StepsNav>
        <MainSection>
            <ActiveComp set={setActiveStep} setFormData={setFormData} formData={formData}  setQuestionPk={setQuestionPk} questionPk={questionPk} />  
        </MainSection>

    </Container>
  )
}

export default AddQuestion