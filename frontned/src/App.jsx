
import './App.css'
import {Navigate, Outlet, Route, Routes, useLocation, matchRoutes } from "react-router-dom"
import AddQuestion from './pages/addQuestion/AddQuestion'
import Questions from './pages/Questions/Questions'
import SingleQuestionPage from './pages/SingleQuestionPage/SingleQuestionPage'
import NavBar from './Components/NavBar'
import TestsPage from './pages/Tests/TestsPage'
import Auth from './pages/auth/Auth'
import { useSelector } from 'react-redux'
import ManageTest from './pages/manageTest/ManageTest'
import toast, { Toaster } from 'react-hot-toast';
import StartTest from './pages/AttemptTest/StartTest'
import AttemptTest from './pages/AttemptTest/AttemptTest'

const IsAdmin = () => { 
  const user = useSelector(p => p.user).user
  if(!user) return <Navigate to="/auth" />
  return user?.isAdmin ? <Outlet/> : <Navigate to="/" />
}
const IsUser = () => { 
  const user = useSelector(p => p.user).user
  return user ? <Outlet/> : <Navigate to="/auth" />
}


function App() {
  const user = useSelector(p => p.user).user


  const location = useLocation();
  
  const hideNavBarRoutes = [
    /^\/test\/attempt\/\d+$/,
    /^\/test\/\d+$/
  ];

  const shouldShowNavBar = !hideNavBarRoutes.some(regex => regex.test(location.pathname));


  return (
    <>
    {shouldShowNavBar && <NavBar user={user} />}
      <Routes>
        <Route element={<IsAdmin/>}>
          <Route path="/addquestion" element={<AddQuestion/>}/>
          <Route path="/tests" element={<TestsPage/>}/>
          <Route path="/test/manage/:id" element={<ManageTest/>}/>
        </Route>
        <Route path="/test/:testid/:token" element={<StartTest/>}/>
        <Route path="/test/attempt/:id" element={<AttemptTest/>}/>


        <Route element={<IsUser/>}>
          <Route path="/question/:id" element={<SingleQuestionPage/>}/>
          <Route path="/questions" element={<Questions/>}/>
        </Route>

        <Route path="/auth" element={<Auth/>}/>

      </Routes>
      <Toaster/>
    </>
  )
}

export default App
