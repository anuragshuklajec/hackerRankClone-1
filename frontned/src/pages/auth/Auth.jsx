import React, { useState } from 'react';
import {  useLocation } from 'react-router-dom';
import styled from 'styled-components';

import RegisterPage from './Register';
import LoginComponent from './login';

const Container = styled.div`

  height: calc(100vh - 65px);
  height: calc(100dvh - 65px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5rem;
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 400px;
  text-align: center;
`

const ForContainer = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 1rem;

  >div {
    flex: 1;
    border: 1px solid #0077cc;
    border-bottom: 4px solid #0077cc;
    padding: 0.7rem 0;
    
  }
`
const ForSomeone = styled.div`
  background-color: ${props => props.isRegister === true ? "rgb(182 225 255)" : "white"};
  cursor: pointer;
`

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
`;




const Auth = () => {
  const location = useLocation() 
  const [isRegister, setIsRegister] = useState(location.state?.isRegister || false)

  return (
    <Container>
      <Wrapper>
        <ForContainer>
          <ForSomeone title='Login' onClick={() => setIsRegister(false)} isRegister={!isRegister}>Login</ForSomeone>
          <ForSomeone title='Register' onClick={() => setIsRegister(true)} isRegister={isRegister}>Register</ForSomeone>
        </ForContainer>
        <Title>{isRegister ? "Register" : "Login"}</Title>
        {isRegister ? <RegisterPage setIsRegister={setIsRegister}/> : <LoginComponent setIsRegister={setIsRegister}/>}
      </Wrapper>
    
    </Container>
  );
};



export default Auth;
