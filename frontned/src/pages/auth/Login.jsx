import React, { useState } from 'react'
import { Button, Form, Input } from './shared'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { userRequest } from '../../api'
import { login } from "../../redux/userSlice"
import ErrorComponent from '../../Components/ErrorComponent'

function LoginComponent() {
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [message, setmessage] = useState(null)
  const [formValues, setFormValues] = useState({ email: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = () => {
    if(!formValues.email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/)) { // eslint-disable-line
      return {message: "emai that you entered is not valid"}
    }
    return {success: true}

  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const valid = validate();
    if(!valid.success) return setmessage({isError: true, message: valid.message})
    setmessage(null)
    try {
      const res = await userRequest.post('/authentication/login',formValues)
      if(res.status === 200) {
        dispatch(login(res.data.message))
        navigate("/")
      }
    } catch (error) {
      console.log(error.response.data.message)
      setmessage({isError: true, message: error.response.data.message})
    }  
  };

  return (
    <Form onSubmit={handleSubmit}>
        <Input required type="email" name="email" placeholder="Email"
          value={formValues.email}
          onChange={handleChange}
        />
        <Input required type="password" name="password" placeholder="Password" autoComplete='on'
          value={formValues.password}
          onChange={handleChange}
        />
        {message && <ErrorComponent data={message} set={setmessage} />}
        <Button type="submit">Login</Button>
    </Form>
  )
}

export default LoginComponent