import React,{useState} from 'react';
import styled from 'styled-components';
import AddEditTests from '../components/AddEditTests';

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

function TestCases() {
    const [tests, setTests] = useState([{name: "test", input: "1,2,3,4", output: "10", score: "10"}])
    const [isOpen, setIsOpen] = useState(true)
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
                <button className='primaryBtn' style={{border: "none", width: "max-content"}} onClick={() => setIsOpen(true)} >Add Question</button>
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
                        {tests.map(e => {
                          return <tr>
                            <th>{e.name}</th>
                            <th>{e.score}</th>
                            <th>{new Blob([e.input]).size}</th>
                            <th>{new Blob([e.output]).size}</th>
                            <th>Actions</th>
                          </tr>
                        })}
                    </tbody>
                </StyledTable>
            </MainSection>
        </Container>
        <AddEditTests isOpen={isOpen} setIsOpen={setIsOpen} tests={tests} setTests={setTests} />
      </>
    );
}

export default TestCases;
