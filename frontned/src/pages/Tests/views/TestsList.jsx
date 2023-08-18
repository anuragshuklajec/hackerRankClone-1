import React, { useEffect, useState } from 'react'
import { publicRequest } from '../../../api'
import styled from "styled-components"
import { BsListCheck } from "react-icons/bs"
import { BiTimer } from "react-icons/bi"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { useNavigate } from 'react-router-dom'


const Container = styled.div`
  display: flex;
  justify-content: center;
`
const Wrapper = styled.div`
  width: min(1200px, 90%);
  tr{
    padding: 2rem 0;
    cursor: pointer;
    border: 1px solid #c0c0c0;
    border-right: none;
    border-left: none;
  }
  td{
    padding: 1rem 0;
  }
  th{
    padding: 1rem 0;
  }
  table{
    width: 100%;
    border-collapse:collapse;
  }
  td{
    text-align: center;
    >svg{
      scale: 1.1;
    }
  }


`

const LeftSide = styled.td`
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: left !important ;
  gap: 0.5rem;

  div{
    display: flex;
    gap: 1rem;

    >small{
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
`


function TestsList() {
  const navigate = useNavigate()
  const [tests, setTests] = useState([])
  useEffect(() => {
    (async() => {
        try {
          const {data} = await publicRequest.get("/test");
          setTests(data.result)
        } catch (error) {
          console.log(error)
        }
    })()
  },[])


  const handleDelete = () => {

  }

  return (
    <Container>
      <Wrapper>
        <table>
          <thead>
            <th></th>
            <th>Users</th>
            <th>attempted</th>
            <th>completed</th>
            <th></th>
          </thead>
          {tests.map(e => {
            return (
              <tr onClick={() => navigate(`/test/manage/${e.id}`)} >
                <LeftSide  >
                  <p className='title' >{e.title}</p>
                  <small>{e.role}</small>
                  <div>
                    <small><BsListCheck/>{e.questions?.length || 10}</small>
                    <small><BiTimer/>{e.duration}</small>
                  </div>
                </LeftSide>
                <td>{e.users?.length || 0}</td>
                <td>{e.attempted}</td>
                <td>{e.completed}</td>
                <td><AiOutlineUsergroupAdd onClick={() => handleDelete(e.id)} /></td>
              </tr>
            )
          })}
        </table>
      </Wrapper>
    </Container>
  )
}

export default TestsList