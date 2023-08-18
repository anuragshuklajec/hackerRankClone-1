import React, { useEffect, useState } from 'react'
import { publicRequest } from '../../api'
import styled from 'styled-components'
import QuestionList from './QuestionList'

const Container = styled.div`
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    justify-content: center;
    padding: 2rem 0;
`
const Wrapper = styled.div`
    width: 1200px;
    min-width: 90%;
    display: flex;
    gap: 3rem;
    flex-direction: column;
`
const DeficultyContainer = styled.div`
    display: flex;
    background-color: #eee;
    width: max-content;

`
const SingleDificulty = styled.div`
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -1px 4px rgba(32,138,70,0.3);
    padding: 0.7rem 1.2rem;
    background-color: ${p => p.isactive === "true" && "#29b35b"};
    color: ${p => p.isactive === "true" && "white"};
`

const TopSection = styled.div`
    display: flex;
    justify-content: space-between;
`

const dificulty = ["all",'Easy','Medium','Hard']

function Questions() {
    const [questions, setQuestions] = useState([])
    const [dificultyFIlter, setDificultyFilter] = useState("all")
    useEffect(()=> {
        (async () => {
            try {
                const {data} = await publicRequest.get("/questions")
                setQuestions(data)
            } catch (error) {
                console.log(error)
            }
        })()
    },[])

    return (
        <Container>
            <Wrapper>
                <TopSection>
                    <h1 className='title' >CPP QUESTIONS</h1>
                    <DeficultyContainer>
                        {dificulty.map(e => <SingleDificulty onClick={() => setDificultyFilter(e)} isactive={(dificultyFIlter === e).toString()} >{e}</SingleDificulty>)}
                    </DeficultyContainer>
                </TopSection>
                <QuestionList data={questions}/>
            </Wrapper>
        </Container>
    )
}

export default Questions