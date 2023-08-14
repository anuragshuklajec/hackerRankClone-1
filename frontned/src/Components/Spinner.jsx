import React from 'react';
import styled, { keyframes } from 'styled-components';

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  display: inline-block;
  width: ${props => props.size || 40}px;
  height: ${props => props.size || 40}px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #333;
  border-radius: 50%;
  animation: ${spinAnimation} 1s linear infinite;
`;

const Spinner = ({ size }) => {
  return <SpinnerContainer size={size} />;
};

export default Spinner;
