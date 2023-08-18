import React from 'react'
import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'
import { publicRequest } from '../../api'

const MainSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

const Container = styled.div`
  border: 1px solid #EAEAEC;
  border-radius: 0.3rem;
  padding: 1rem;
  box-shadow: 0 0 2px 1px rgba(0,0,0,0.1);
  cursor: pointer;


  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Left = styled.div`
  h4{
    font-size: 1.5rem;
    color: #0e141e;
    font-weight: 400;
    line-height: 1.4;
    margin-bottom: 0.5rem;
    text-transform: capitalize;
  }
  >div{
    display: flex;
    gap: 0.5rem;
  }
`
const Right = styled.div`
  >button{
    border: none;
  }
`

function QuestionList({ data, withControls = false, test }) {
  const navigate = useNavigate()

  const handleAddQuestion = async (questionId) => {
    try {
      const {data} = await publicRequest.post("/addQuestionToTest", {test, question: questionId})
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <MainSection>
      {data.map(e => (
        <Container>
          <Left>
            <h4>{e.fields.title}</h4>
            <div>
              <p>{e.fields.difficulty}</p> |
              <p>Time: {e.fields.recommended_time}min</p>|
              <p>created At: {e.fields.created_at}</p>
            </div>
          </Left>
          <Right>
            {withControls ?
            <button className='primaryBtn' onClick={() => handleAddQuestion(e.pk)} >add Question</button>
            :
            <button className='primaryBtn' onClick={() => navigate(`/question/${e.pk}`)} >Solve Question</button>
          }
          </Right>
        </Container>
      ))}
    </MainSection>
  )
}

export default QuestionList