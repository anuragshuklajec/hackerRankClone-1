import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { InputWrapper } from '../../shared/styled';
import Checkbox from '../../Components/Checkbox';
import { useSelector } from 'react-redux';
import { publicRequest } from '../../api';
import { useLocation } from 'react-router-dom';

const Container = styled.div`
    display: flex;
    overflow: hidden;
    height: 100vh;
    height: 100dvh;

    >div{
        flex: 1;
    }
`;

const Left = styled.div`
    padding: 60px;
    flex: none;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

`;

const LeftInfo = styled.div`
    >p {
        margin: 1rem 0;

    }
    >h1{
        color: #0e141e;
        padding: 0;
        word-break: break-word;
        font-weight: 700;
        font-size: 40px;
        line-height: 1.2;
    }
`

const Right = styled.div`
    background-color: #F3F7F7;
    flex: 1;
    overflow-y: scroll;
    scroll-behavior: smooth;
    p {
        color: #39424e;
        margin: 0.5rem 0;
    }
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 15rem 1rem 2rem 4rem;
    width: min(600px, 100%);
    >h2 {
        font-size: 40px;
    }
    ol{
        list-style-position: outside;
        margin: 1rem 0;
        margin-left: 1rem;

        li{
            font-weight: 400;
            margin-bottom: 1rem;
        }
    }

    >a {
        width: max-content;
    }
    ${InputWrapper} {
        margin: 0.5rem 0;
    }
`

const QuestionsList = styled.div`
    margin: 1rem 0;
    display: flex;  
    .left{
        width: 200px;
    }
    .right{
        flex: 2;
    }
`
const CheckBoxContainer = styled.div`
    margin: 2rem 0;
    display: flex;
    gap: 1rem;
    >div{padding: 0.5rem 0}
    input{
        scale: 1.3;
    }
    p{
        text-wrap: balance;
    }
`

function StartTest() {
    const user = useSelector(e => e.user.user)
    const [formData, setFormData] = useState({name: `${user.firstname} ${user.lastname}`, expe: "", email: user.email, isChecked: false})
    const [testInfo, setTestInfo] = useState();

    const location = useLocation()
    const testid = location.pathname.split("/")[2]
    useEffect(() => {
        (async () => {
            try {
                const {data} = await publicRequest.get(`test?id=${testid}`)
                setTestInfo(data.result)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])

    const handleChange = (e) => setFormData(p => ({...p, [e.target.name]: e.target.value}))
    
    return (
        <Container>
            <Left>
                <LeftInfo>
                    <p>hey {user.firstname},</p>
                    <h1>Welcome to </h1>
                    <h1>{testInfo?.title}</h1>
                    <p>{testInfo?.role}</p>
                </LeftInfo>
            </Left>
            <Right>
                <Section id="instructions" >
                    <h2 className='title' >Instructions</h2>
                    <ol>
                        <li>This is a timed test. Please make sure you are not interrupted during the test, as the timer cannot be paused once started.</li>
                        <li>Please ensure you have a stable internet connection.</li>
                        <li>We recommend you to try the sample test for a couple of minutes, before taking the main test.</li>
                        <li>Before taking the test, please go through the FAQs to resolve your queries related to the test or the HackerRank platform.</li>
                    </ol>
                    <a className='primaryBtn'  href="#questions"  >Continue</a>
                </Section>
                <Section id="questions" >
                    <h2 className='title' >Questions</h2>
                    <p>Feel free to choose your preferred programming language from the list of languages supported for each question.</p>
                    <p>There are {testInfo?.questionLength} questions that are part of this test.</p>
                    <QuestionsList>
                        <div className='left'>{testInfo?.questionLength <= 1 ? "Q1" : `Q1-Q${testInfo?.questionLength}`}</div>
                        <div className='Right'>Coding Question</div>
                    </QuestionsList>
                    <a className='primaryBtn'  href="#confirmation">Continue</a>
                </Section>
                <Section id="confirmation" >
                    <h2 className='title' >Confirmation Form</h2>
                    <p>Before we start, here is some extra information we need to assess you better.</p>
                    <InputWrapper>
                        <label>Email Address</label>
                        <input className='primaryInput' type="email"  name="email" value={formData.email} onChange={handleChange} />
                    </InputWrapper>
                    <InputWrapper>
                        <label>Full Name</label>
                        <input className='primaryInput' type="name" placeholder='Enter your fullname' name="name" value={formData.name} onChange={handleChange}  />
                    </InputWrapper>
                    <InputWrapper>
                        <label>Work Experience (in years)</label>
                        <select className='primaryInput' name="expe" value={formData.expe} onChange={handleChange} >
                            <option>{"< 1"}</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>{"> 5"}</option>
                        </select>
                    </InputWrapper>
                    <CheckBoxContainer>
                        <div><input type='checkbox' checked={formData.isChecked} onChange={e => setFormData(p => ({...p, isChecked: e.target.checked}))} /></div>
                        <p>I agree not to copy code from any source, including websites, books, or colleagues. I may refer to language documentation or an IDE of my choice. I agree not to copy or share HackerRank’s copyrighted assessment content or questions on any website or forum.</p>
                    </CheckBoxContainer>
                    <a className='primaryBtn'  href="#instructions2">Continue</a>
                </Section>
            </Right>
        </Container>
    );
}

export default StartTest;
