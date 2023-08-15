import React from 'react'
import styled from "styled-components"

const Status = styled.div`
    padding: 0.5rem 1rem;
    background-color: ${p => p.success ? "#a7ffa7" : "#ffc9c9"};
    color: ${p => p.success ? "green" : "red"};
    font-weight: 600;
    letter-spacing: 2px;
    border-radius: 0.2rem;
`

const TestContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 1rem 0; 
    gap: 0.5rem;
`
const TopSection = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: space-between;
    >p{
        color: #575757;
        font-size: 1.2rem;
        letter-spacing: 2px;
    }
`
const BottomSection = styled.div`
    
`

function ResultComp({response}) {
  return response && (
    <div className="response">
        {response.success ? (
            <div >
            <h1>Success</h1>
            {response.message.map(e => {
                return (
                    <TestContainer>
                        <TopSection>
                            <p>{e.test.name} | Points : {e.test.score} {e.error && "|  Runtime error"}</p>
                            <Status success={e.success} >{e.success ? "Success" : "Failed"}</Status>
                        </TopSection>
                        <BottomSection>
                            {!e.success  &&<pre className='response failed' >{e.error ? e.error : e.output}</pre >}
                            {e.success && <pre className='response success' >{e.output}</pre>}
                        </BottomSection>
                    </TestContainer>
                )
            })}
            </div>
        ) : (
            <div className="response">
            <h1>Failed {response.message.compiled ? "Internal server Error" : "Compiled Error"}</h1>
            <div>
                <pre className="response failed">{response.message.error}</pre>
            </div>
            </div>
        )}
    </div>
  )
}

export default ResultComp