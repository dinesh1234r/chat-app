import React from 'react'
import { useNavigate } from 'react-router-dom'
import {BiPowerOff} from 'react-icons/bi'
import styled from 'styled-components';

function Logout() {
    const navigate=useNavigate();
    const handleLogout=()=>{
        navigate('/')
        localStorage.clear();
    }
  return (
    <FormContainer onClick={handleLogout}>
        <BiPowerOff />
    </FormContainer>
  )
}

const FormContainer=styled.div`
display:flex;
justify-content:center;
align-items:center;
padding:0.5rem;
border-radius:0.5rem;
background-color:blue;
border:none;
cursor:pointer;
svg{
    font-size:1.4rem;
    color:black
}
`;
export default Logout