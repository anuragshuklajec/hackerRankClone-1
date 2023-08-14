import React,{useEffect, useState} from 'react';
import styled from 'styled-components';
import AddEditTests from '../components/AddEditTests';
import {AiFillDelete} from "react-icons/ai"
import {BiSolidEdit} from "react-icons/bi"
import { publicRequest } from '../../../api';
import { useNavigate } from "react-router-dom"

const Container = styled.div`
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const TopSection = styled.div`
    > h1 {
        margin: 1rem 0;
        font-weight: 600;
        font-size: 1.3rem;
        color: #626b7f;
    }
    p {
        color: #626b7f;
    }
`;

const MainSection = styled.div`
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Title = styled.h1`
    font-size: 1.5rem;
    color: #2CC162;
    margin-bottom: 1rem;
`;


const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #E7E7E7;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    th,
    td {
        padding: 0.5rem;
        text-align: center;
    }
    th {
        background-color: #f8f8f8;
        color: #5e5e5e;
    }
    td {
        color: #555;
    }
`;
const IconsContainer = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
    >svg{
        font-size: 1.3rem;
        cursor: pointer;
    }
`

const BtnWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    button{
        border: none;
        width: max-content; 
        margin-top: 2rem;
    }
`

function TestCases({questionPk}) {
    const navigate = useNavigate()
    const [tests, setTests] = useState([])
    const [isOpen, setIsOpen] = useState(false)

    const [editIndex, setEditIndex] = useState(null)

    const handleDelete = (index) => setTests(p => p.filter((e, i) => index !== i))
    

    useEffect(() => {
        if(isOpen === false) setEditIndex(null)
    },[isOpen])

    const handleSubmit = async () => {
        try {
            const {data} = await publicRequest.post("/testCase", {tests, questionId: questionPk})
            navigate("/questions")
        } catch (error) {
            console.log(error)
        }
    }

    return (
      <>
        <Container>
            <TopSection>
                <Title>Test Cases</Title>
                <p>
                    Each test case includes input values provided through the program's STDIN and expects output through its STDOUT. Input informs the program's behavior, and the anticipated output is compared to the actual result.
                </p>
            </TopSection>

            <MainSection>
                <button className='primaryBtn' style={{border: "none", width: "max-content"}} onClick={() => setIsOpen(true)} >Add Tests</button>
                <StyledTable>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Score</th>
                            <th>Input Size</th>
                            <th>Output Size</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody> 
                        {tests.map((e, i) => {
                          return <tr>
                            <td>{e.name}</td>
                            <td>{e.score}</td>
                            <td>{new Blob([e.input]).size}</td>
                            <td>{new Blob([e.output]).size}</td>
                            <td>
                                <IconsContainer>
                                    <BiSolidEdit onClick={() => {setIsOpen(true); setEditIndex(i)}} />
                                    <AiFillDelete onClick={() => handleDelete(i)} />
                                </IconsContainer>
                            </td>
                          </tr>
                        })}
                    </tbody>
                </StyledTable>
            </MainSection>
            <BtnWrapper><button className='primaryBtn' onClick={handleSubmit} >Save Test</button></BtnWrapper>
        </Container>
        <AddEditTests isOpen={isOpen} setIsOpen={setIsOpen} tests={tests} setTests={setTests} editIndex={editIndex} setEditIndex={setEditIndex} />
      </>
    );
}

export default TestCases;
