import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Form, Input } from './shared';
import { userRequest } from '../../api';
import ErrorComponent from '../../Components/ErrorComponent';



const RegisterPage = ({setIsRegister}) => {
  const navigate = useNavigate()
  const [message, setmessage] = useState(null)
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = () => {
    const emailRegex = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"; // eslint-disable-line
    console.log(formValues.name.split(" ").length)
    if(formValues.name.split(" ").length < 2) return {message: "Please enter your full name"}
    if(!formValues.email.match(emailRegex)) return {message: "emai that you entered is not valid"}
    if(formValues.password.length < 8) return {message: "Password must be atlist 8 charectors"}
    if(formValues.password !== formValues.confirmPassword) return  {message: "Password with confirm password dosent matched"}
    return {success: true}
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValidate = validate();
    if(!isValidate.success) return setmessage({isError: true, message: isValidate.message})
    setmessage(null)
    try {
      const res = await userRequest.post('/authentication/createUser', {...formValues, firstName: formValues.name.split(" ")[0], lastName: formValues.name.split(" ")[1]})
      if(res.status === 200) setIsRegister(false)
    } catch (error) {
      console.log(error)
      setmessage({isError: true, message: error.response.data.message})
    }
  };

  return (
      <Form onSubmit={handleSubmit}>
        <Input
          required
          type="text"
          name="name"
          placeholder="Name"
          value={formValues.name}
          onChange={handleChange}
        />
        <Input
          required
          type="email"
          name="email"
          placeholder="Email"
          value={formValues.email}
          onChange={handleChange}
        />
        <Input
          required
          type="password"
          name="password"
          placeholder="Password"
          autoComplete='on'
          value={formValues.password}
          onChange={handleChange}
        />
        <Input
          required
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          autoComplete='on'
          value={formValues.confirmPassword}
          onChange={handleChange}
        />
        {message && <ErrorComponent data={message} set={setmessage}></ErrorComponent>}
        <Button type="submit">Register</Button>
      </Form>
  );
};


export default RegisterPage;
