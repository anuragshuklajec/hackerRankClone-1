import React, { useState } from 'react'
import styled from 'styled-components'
import TestsNav from '../../Components/TestsNav'
import CreateTest from './components/CreateTest'
import TestsList from './views/TestsList'

const navItemsData = [
    {title: "Active Tests", active: true},
    {title: "Archiced Tests"},
    {title: "Candidates"},
]

const Container = styled.div`
    padding: 1rem 0;
`
const TopSection = styled.div`
    padding: 1rem 0.5rem;
    display: flex;
    justify-content: space-between;
`

const MainSection = styled.div`

`

function TestsPage() {
  const [navItems, setNavItems] = useState(navItemsData)
  const [isCreateTestOpen, setIsCreateTestOpen] = useState(false)
  const [tests, setTests] = useState([])




  return (
    <>
      <Container>
            <TopSection>
              <TestsNav items={navItems} setItems={setNavItems} />
              <button onClick={() => setIsCreateTestOpen(true)}  className='primaryBtn'>Create Test</button>
            </TopSection>
            <MainSection>
                <TestsList setTests={setTests} tests={tests} />
            </MainSection>
      </Container>
      <CreateTest isOpen={isCreateTestOpen} setIsOpen={setIsCreateTestOpen} setTests={setTests}/>
    </>
  )
}

export default TestsPage