import Editor from './Components/Editor'
import './App.css'
import {Route, Routes } from "react-router-dom"
import AddQuestion from './pages/addQuestion/AddQuestion'


function App() {

  return (
    <Routes>
      <Route path="/question/:id" element={<Editor/>}/>
      <Route path="/addquestion" element={<AddQuestion/>}/>
      
      
      
    </Routes>
  )
}

export default App
