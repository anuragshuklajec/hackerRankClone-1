import React from 'react'
import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'

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

function SingleQuestion({ data }) {
  const navigate = useNavigate()
  return (
    <Container>
      <Left>
        <h4>{data.fields.title}</h4>
        <div>
          <p>{data.fields.difficulty}</p> |
          <p>Time: {data.fields.recommended_time}min</p>|
          <p>created At: {data.fields.created_at}</p>
        </div>
      </Left>
      <Right>
        <button className='primaryBtn' onClick={() => navigate(`/question/${data.pk}`)} >Solve Question</button>
      </Right>
    </Container>
  )
}

export default SingleQuestion