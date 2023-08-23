import React from 'react';
import styled from 'styled-components';

// Define the styled components
const CustomCheckboxLabel = styled.label`
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  color: #333;
`;

const CustomCheckboxInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

const Checkmark = styled.span`
  position: relative;
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 8px;

  /* Style the checkmark when the checkbox is checked */
  ${CustomCheckboxInput}:checked + &::after {
    content: '\2713'; /* Unicode checkmark symbol */
    position: absolute;
    top: 1px;
    left: 4px;
    font-size: 14px;
    color: #007bff;
  }
`;

const Checkbox = (p) => {
  return (
    <CustomCheckboxLabel>
      <CustomCheckboxInput type="checkbox" {...p} />
      <Checkmark />
    </CustomCheckboxLabel>
  );
};

export default Checkbox;
