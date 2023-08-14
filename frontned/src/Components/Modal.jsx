import React, { useState } from 'react';
import styled from 'styled-components';
import {AiOutlineClose} from "react-icons/ai"

const ModalBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s ease-in-out;
    z-index: 1000;
`;

const ModalContainer = styled.div`
    width: 700px;
    max-width: 90%;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 1rem;
    border-radius: 4px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    z-index: 1001;
`;

const ModalTitle = styled.h2`
    margin-top: 0;
`;

const IconWrapper = styled.div`
    padding: 0.5rem;
    > svg {
        font-size: 1.4rem;
        cursor: pointer;
        fill: initial;
    }
`;


const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: color 0.3s ease-in-out;
`

function Modal({title, isOpen, setIsOpen, children}) {
    const toggleModal = () => setIsOpen(p => !p);

    return isOpen && (
        <>
            <ModalBackdrop isOpen={isOpen} onClick={toggleModal} />
            <ModalContainer isOpen={isOpen}>
                <Header>
                    <ModalTitle>{title}</ModalTitle>
                    <IconWrapper onClick={toggleModal} ><AiOutlineClose/></IconWrapper>
                </Header>
                {children}
            </ModalContainer>
        </>
    );
}

export default Modal;
