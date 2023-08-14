import React from 'react'
import styled from "styled-components"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { publicRequest } from '../../../api';

const Container = styled.div`
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    >div{
        display: flex;  
        gap: 0.5rem;
    }
`
 
const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    >label{
        text-transform: uppercase;
    }
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

const Editor = styled(ReactQuill)`
    margin-bottom: 3rem;
    height: 450px;
`

const BtnWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
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

const dificulty = [ 'Easy','Medium','Hard',]
function ProblemStatement({set, setFormData, formData}) { 
    const handleChange = e => setFormData(p => ({...p, [e.target.name]: e.target.value}))

    const handleSubmit = async () => set(p => p+1)
    return (
        <Container>
            <div>
                <InputWrapper>
                    <label>problem name</label>
                    <input name="title" className='primaryInput' onChange={handleChange}/>
                </InputWrapper>
                <InputWrapper>
                    <label>recommended time</label>
                    <input name="recommended_time" className='primaryInput' placeholder='In minutes' onChange={handleChange} />
                </InputWrapper>

            </div>
            <div>
                <InputWrapper>
                    <label>difficulty</label>
                    <DeficultyContainer>
                        {dificulty.map(e => <SingleDificulty onClick={() => setFormData(p => ({...p, difficulty: e}))} isactive={(formData.difficulty === e).toString()} >{e}</SingleDificulty>)}
                    </DeficultyContainer>
                </InputWrapper>
            </div>

            <div>
                <InputWrapper>
                    <label>problem description</label>
                    <Editor theme="snow" modules={modules}  value={formData.description} onChange={e => setFormData(p => ({...p, description: e}))} />
                </InputWrapper>
            </div>

            <BtnWrapper>
                <button className='primaryBtn' onClick={handleSubmit} >Next Step</button>
            </BtnWrapper>

        </Container>
  )
}

export default ProblemStatement