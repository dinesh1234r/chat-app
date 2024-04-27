import React from 'react';
import styled from 'styled-components'; 
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react';
import axios from 'axios'

function Register() {
  const navigate = useNavigate();

  const [values,setValues]=useState({
    username:"",
    email:"",
    password:"",
    confirmPassword:""
  })
  const valid=()=>{
    const {username,email,password,confirmPassword}=values;
    if(username.length<6)
    {
      toast.error("Username must contain atleat 6 character")
      return false;
    }
    else if(email.length==0)
    {
      toast.error("Email does not be empty")
      return false;
    }
    else if(password.length<5)
    {
      toast.error("Password must contain atleat 5 character")
      return false;
    }
    else if(password!=confirmPassword)
    {
      toast.error("Password and Conform password must be same")
      return false;
    }
    else{
      return true;
    }
  }
  const handlechange=(event)=>{
    setValues({...values,[event.target.name]:event.target.value})
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (valid()) {
      const { username, email, password } = values
      try {
        const response = await axios.post('https://chat-app-backend-nst9.onrender.com/register', {
          username,
          email,
          password
        });
        if (response.data.msg === "Registered successfully") {
          
          toast.success("Registered successfully",{
            onClose:()=>{
              navigate('/');
            },
            autoClose:1000
          })
        } else {
          toast.error(response.data.msg);
        }
        
        
      } catch (error) {
        console.error("Error occurred:", error);
        toast.error("Error occurred while registering.");
      }
    }
  }
  
    


  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className='brand'>
            <img src={Logo} alt="Logo" />
            <h1>Chat-App</h1>
          </div>
          <input type='text' name='username' placeholder='UserName' onChange={(e)=>handlechange(e)}/>
          <input type='text' name='email' placeholder='Email' onChange={(e)=>handlechange(e)}/>
          <input type='password' name='password' placeholder='Password' onChange={(e)=>handlechange(e)}/>
          <input type='password' name='confirmPassword' placeholder='Confirm Password' onChange={(e)=>handlechange(e)}/>
          <button type='submit'>Submit</button>
        </form>
      </FormContainer>
      <ToastContainer/>
    </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  
`;

export default Register;

