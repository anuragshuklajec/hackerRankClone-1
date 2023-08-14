import React, { useEffect, useState } from 'react'
import Editor from '../../Components/Editor'
import { publicRequest } from '../../api';
import { useLocation } from 'react-router-dom';
import styled from "styled-components"
import Spinner from '../../Components/Spinner';
import ResultComp from './ResultComp';

const Container = styled.div`
    margin: 1rem 0;
    display: flex;
    justify-content: center;

`
const Wrapper = styled.div`
    width: 1500px;
    max-width: 90%;
`

const TopSection = styled.div`
    display: flex;
    >div{
        width: 50%;
    }
`
const BottomSection = styled.div``

const Left = styled.div`
    
`

const Right = styled.div`
    
`
const BtnWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    >button{
        border: none;
    }
`

function SingleQuestionPage() {
    const [code, setcode] = useState(``);
    const [response, setResponse] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const location = useLocation()
    const questionId = location.pathname.split("/")[2]
    const [questionData, setQuestionData] = useState()

    useEffect(()=> {
        (async () => {
            try {
                const {data} = await publicRequest.get(`/questions?id=${questionId}`)
                setQuestionData(data.fields)
                setcode(data.fields.starter_code)
            } catch (error) {
                console.log(error)
            }
        })()
    },[questionId])

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
          const { data } = await publicRequest.post(`/run`, {
            questionId,
            code,
          });
          setResponse(data);
        } catch (error) {
          console.log(error)
          // setError("Internal server error");
        }
        setIsLoading(false)
      };

    return (
        <Container>
            <Wrapper>
                <TopSection>
                    <Left>
                        <p className='title'>{questionData?.title}</p>
                        <div dangerouslySetInnerHTML={{ __html: questionData?.description }} />
                    </Left>
                    <Right>
                        <Editor code={code} setcode={setcode} />
                        <BtnWrapper>
                            <button className='primaryBtn'  onClick={handleSubmit}   >{isLoading ? <><Spinner size={20} /> Processing</> : "Submit" }</button>
                        </BtnWrapper>
                    </Right>
                </TopSection>
                <BottomSection>
                    <ResultComp response={response} />
                </BottomSection>
            </Wrapper>
        </Container>
    )
}

export default SingleQuestionPage