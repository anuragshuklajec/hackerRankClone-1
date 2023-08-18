import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import Questions from "../Questions/Questions"
import QuestionList from '../Questions/QuestionList'
import { useLocation } from 'react-router-dom'
import { publicRequest } from '../../api'
import TestsNav from '../../Components/TestsNav'
import QuestionsListForManage from './components/QuestionsListForManage'
import Settings from './components/Settings'

const Container = styled.div``
const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0.5rem;
`
const Title = styled.h1`
  font-weight: 500;

`
const Options = styled.div``
const MainContainer = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
`
const Wrapper = styled.div`
  width: min(1200px, 90%);
`


const items = [
  { title: "Questions", active: true, component: QuestionsListForManage, withFilter: true },
  { title: "add Questions", component: QuestionList,   },
  { title: "Settings", component: Settings },
];

function ManageTest() {
  const [navItems, setNavItems] = useState(items)
  const [test, setTest] = useState()
  const [questionList, setQuestionList] = useState([])
  const location = useLocation()
  const id = location.pathname.split("/")[3]

  useEffect(() => {
    (async() => {
      try {
        const {data} = await publicRequest.get(`test?id=${id}`)
        setTest(data.result)
      } catch (error) {
        console.log(error)
      }
    })()
  },[])

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  useEffect(() => {
    const withFilter = navItems[activeTabIndex].withFilter || false;

    (async() => {
      try {
        const {data} = await publicRequest.get(`/questions${withFilter ?`?test=${id}` : ''}`)
        setQuestionList(data)
      } catch (error) {
        
      }
    })()

  },[navItems])

  const Component = navItems[activeTabIndex].component

  return (
    <Container>
        <TopContainer>
            <Title>{test?.title}</Title>
            <Options>
                <button className='primaryBtn' >INVITE</button>
            </Options>
        </TopContainer>
        <MainContainer>
            <TestsNav items={navItems} setItems={setNavItems} setIndex={setActiveTabIndex} />
            <Wrapper>
              <Component data={questionList} withControls={true} test={id} />
            </Wrapper>
        </MainContainer>
    </Container>
  )
}

export default ManageTest