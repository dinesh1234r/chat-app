import React from 'react'
import Robo from '../assets/robot.gif'
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function Welcome() {
    const user=JSON.parse(localStorage.getItem('userinfo'));
    const navigate=useNavigate();
    if(!user)
    {
        navigate('/')
    }
  return (
    <div>
        <FormContainer>
            <img src={Robo} alt='Robot'/>
            <h1> Welcome, <span>{user.username}!</span></h1>
            <h3>Please select a chat to start message</h3>
        </FormContainer>
    </div>
  )
}

const FormContainer=styled.div`
display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
color:white;
img{
    height:25rem;
}
span{
    color:blue;
}
`;

export default Welcome