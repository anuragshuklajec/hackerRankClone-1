import React, { useEffect } from 'react'
import styled from 'styled-components';
import {AiOutlineClose} from "react-icons/ai"

const ErrorWrapper = styled.div`
  position: relative;
  border: solid 1px ${p => p.isError ? "red" : "green"};
  padding: 0.4rem 5px;
  background-color: ${p => p.isError ? "#ffcccb" : "#a6f7a8"};
  border-radius: 1vmin;
  height: max-content;
  display: flex;
  justify-content:center;
  >p {
    color: ${p => p.isError ? "red" : "green"};
  }
`

const Error = styled.p`
    margin: 0;
    text-align: center;
    width: 100%;
    font-weight: 600;

  >svg {
    opacity: 20%;
    cursor: pointer;
    position: absolute;
    height: 100%;
    width: 20px;
    right: 10px;
    top: 0;
    bottom: 0;

    :hover {
      opacity: 100%;
    }
  }
`

function ErrorComponent({data, set}) {
    const id = Math.random() * 1000

    useEffect(() => {
        let interval;
        if(data) {
          // interval = setInterval(() => {
          //   set(null);
          // }, 5000);
        }
      
        return () => clearInterval(interval);
      }, [id]);

  return (
    <>
    <ErrorWrapper isError={data?.isError}>
        <Error>
            {data?.message}<AiOutlineClose onClick={() => set(false)}/>
        </Error>
    </ErrorWrapper>
    </>
  )
}

export default ErrorComponent