import React from 'react'
import { styled } from 'styled-components'

const Conatainer = styled.div`
    display: flex;
    gap: 1rem;
    padding: 0 1rem;
`

const SingleNav = styled.div`
    padding: 0 0.5rem;
    border-bottom: ${p => p.active && "1px solid black"};
    cursor: pointer;
    :hover{
      border-bottom: 1px solid #c0c0c0;
      background-color: red;
    }
`

function TestsNav({items, setItems}) {
  const handleChangeTab = (index) => {
    setItems(p => p.map((e, i) => {
      if(i === index){
        return {...e, active: true}
      } else return {...e, active: false}
    }))
  }

  return (
    <Conatainer>
        {items?.map((e, index) => <SingleNav active={e.active} onClick={() => handleChangeTab(index)}  >{e.title}</SingleNav>)}
    </Conatainer>
  )
}

export default TestsNav