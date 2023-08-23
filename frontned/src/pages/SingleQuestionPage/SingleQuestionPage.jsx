import React, { useEffect, useState } from 'react'
import AceEditorComponent from '../../Components/AceEditor'
import { publicRequest } from '../../api';
import { useLocation } from 'react-router-dom';
import styled from "styled-components"
import Spinner from '../../Components/Spinner';
import ResultComp from './ResultComp';
import CodeMirrorEditor from '../../Components/CodeMirroeEditor';

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
    gap: 1rem;
    >div{
        width: 50%;
    }
`
const BottomSection = styled.div``

const Left = styled.div`
    
`

const Right = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
          console.log({data})
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
                        {/* <AceEditorComponent code={code} setcode={setcode} /> */}
                        <CodeMirrorEditor code={code} setcode={setcode} />
                        <BtnWrapper>
                            <button style={{display: 'flex', alignItems: "center", gap: "0.5rem"}}  className='primaryBtn'  onClick={handleSubmit}   >{isLoading ? <><Spinner size={20} /> Processing</> : "Submit" }</button>
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