import React,{useEffect, useState} from 'react';
import styled from 'styled-components'; 
import { useNavigate,Link } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

function Login() {
  const navigate=useNavigate();
  useEffect(()=>{
    const check=JSON.parse(localStorage.getItem('userinfo'))
    if(check)
    {
      if(check.isAvatarImageSet)
      {
        navigate('/Chat');
      }
      else if(!check.isAvatarImageSet)
      {
        navigate('/setAvatar')
      }
    }
  },[])
  
  const [values,setValues]=useState({
    username:"",
    password:""
  })
  const valid=()=>{
    const {username,email,password,confirmPassword}=values;
    if(username.length<6)
    {
      toast.error("Username must contain atleat 6 character")
      return false;
    }
    else if(password.length<5)
    {
      toast.error("Password must contain atleat 5 character")
      return false;
    }
    else{
      return true;
    }
  }
  const handlechange=(event)=>{
    setValues({...values,[event.target.name]:event.target.value})
  }
  const handleSubmit = async(event) => {
    event.preventDefault();
    if(valid())
    {
      console.log("success")
      const {username,email,password}=values
      const response=await axios.post('http://localhost:9000/login',{username,email,password})
      if(response.data.msg=="Login Successfully")
      {
        localStorage.setItem('userinfo',JSON.stringify(response.data.user))
        localStorage.setItem('jwt',response.data.token)
        if(response.data.user.isAvatarImageSet)
        {
          toast.success("Login Successfully",{
            onClose:()=>{
              navigate('/Chat');
            },
            autoClose:500
          })
          
        }
        else{
          toast.success("Login Successfully",{
            onClose:()=>{
              navigate('/setAvatar')
            },
            autoClose:500
          })
          
        }
        
        
      }
      else{
        toast.error("error");
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
          
          <input type='password' name='password' placeholder='Password'onChange={(e)=>handlechange(e)}/>
          
          <button type='submit'>Submit</button>
        </form>
        <span>Don't Have a Account ? <Link to={'/register'}>Register</Link></span>
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
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
  
`;

export default Login;

