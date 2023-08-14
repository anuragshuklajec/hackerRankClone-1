import Editor from './Components/Editor'
import './App.css'
import {Route, Routes } from "react-router-dom"
import AddQuestion from './pages/addQuestion/AddQuestion'
import Questions from './pages/Questions/Questions'
import SingleQuestionPage from './pages/SingleQuestionPage/SingleQuestionPage'


function App() {

  return (
    <Routes>
      <Route path="/question/:id" element={<SingleQuestionPage/>}/>
      <Route path="/addquestion" element={<AddQuestion/>}/>
      <Route path="/questions" element={<Questions/>}/>
      
      
    </Routes>
  )
}

export default App
