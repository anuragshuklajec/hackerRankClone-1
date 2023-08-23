import React, { useEffect, useRef, useState } from 'react'
import Modal from "../../../Components/Modal"
import styled from "styled-components   "
import { RxCross1 } from "react-icons/rx"
import { toast } from 'react-hot-toast'
import { InputWrapper } from '../../../shared/styled'
import { publicRequest } from '../../../api'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Editor = styled(ReactQuill)`
    margin-bottom: 5rem;
    height: 300px;
`

const modules = {
    toolbar: [
        [{ header: [] }, { header: '1' }, { font: [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block', 'link', 'image', 'video'],
        [{ align: [] }],
        ['clean'],
        ['table']
    ],
};

const MainContainer = styled.div`
    margin: 1rem 0;
`

const Input = styled.div`
    display: flex;
    padding: 0.5rem 0.3rem;
    border: 1px solid #E6E9EC;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;

    >input{
        border: none;
        height: 100%;
        width: 100%;
        font-size: 1.2rem;
        outline: none;
    }
`
const SingleEmail = styled.div`
    padding: 0.4rem 0.5rem;
    border-radius: 0.5rem;
    background-color: #E5E7EB;
    display: flex;
    align-items: center;
    gap: 0.6rem;
`

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
`

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
function AddUserToTest({isOpen, setIsOpen, testInfo}) {
    const [usersEmail, setUsersEmail] = useState([])
    const [formData, setFormData] = useState({title: "", desc: ""})
    useEffect(() => {
        setFormData({
            title: testInfo.title, 
            desc: `You've been invited to take the ${testInfo.title} test. This test is designed for the role of ${testInfo?.role} and covers a variety of topics related to the role.`
        })
    }, [testInfo])
    const inputRef = useRef()

    const addUserEmail = (e) => {
        if(e.code !== "Enter") return 
        const value = inputRef.current.value
        if(!emailRegex.test(value)) return toast.error(`${value} is not a valid Email`)

        setUsersEmail(p => [...p.filter(e => e !== value), value])
        inputRef.current.value = ""
    }

    const handleRemove = (email) => {
        setUsersEmail(p => p.filter(e => e !== email))
    }


    const handleChange = (e) => {
        setFormData(p =>({...p, [e.target.name]: e.target.value}))
    }

    const handleSubmit = async () => {
        try {
            const {data} = await toast.promise(
                publicRequest.post("/testInvitation", {testid: testInfo.id,users: usersEmail, ...formData}),
                {
                    loading: `Sending invitation to all ${usersEmail.length} users`,
                    success: <b>Invitation send to all {usersEmail.length} users!</b>,
                    error: <b>Failed to send invitaiton!!</b>,
                }
            )
            setIsOpen(false)
        } catch (error) {
            console.log(data)
        }
    }
  

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Invite people to this Test"  >
        <MainContainer  >
            <InputWrapper onClick={() => inputRef.current.focus()} >
                <label>To :</label>
                <Input className="primaryInput" >
                    {usersEmail.map(email => <SingleEmail key={email} >{email} <RxCross1 onClick={() => handleRemove(email)} /></SingleEmail>)}
                    <input ref={inputRef} onKeyDown={addUserEmail} />
                </Input>
            </InputWrapper>
            <InputWrapper>
                <label>Title :</label>
                <input className='primaryInput' name="title" onChange={handleChange} value={formData.title} ></input>
            </InputWrapper>
            <InputWrapper>
                <label>Description :</label>
                <Editor theme="snow" modules={modules}  value={formData.desc} onChange={e => setFormData(p => ({...p, desc: e}))} />
            </InputWrapper>
            <ButtonWrapper>
                <button className="btnSmall" onClick={() => setIsOpen(false)} >Cancel</button>
                <button className='primaryBtn' onClick={handleSubmit} >invite {usersEmail.length} users</button>
            </ButtonWrapper>
        </MainContainer>
    </Modal>
  )
}

export default AddUserToTest