import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Contact from '../components/Contact'
import { constants } from 'buffer';
import axios from 'axios'
import Welcome from '../components/Welcome';
import Chatcontainer from '../components/Chatcontainer';
import {io} from 'socket.io-client'

function Chat() {
  // const [currentuser,setCurrentuser]=useState(undefined);
  const [contacts,setContacts]=useState([])
  const [currentchat,setCurrentchat]=useState(undefined);
  const navigate=useNavigate();
  const socket=useRef();
  const currentuser=JSON.parse(localStorage.getItem('userinfo'))
  
  // useEffect(()=>{
  //    const userdata= localStorage.getItem('userinfo')
  //    if(!userdata)
  //    {
  //     navigate('/');
  //    }
  //    else
  //    {
  //     setCurrentuser(JSON.parse(localStorage.getItem('userinfo')))
  //    }
  // },[]);
  
  useEffect(()=>{
    if(currentuser)
    {
      socket.current=io("http://localhost:9000");
      socket.current.emit("add-user",currentuser._id);
    }
  },[currentuser])

  useEffect(()=>{
    if(currentuser)
    {
      if(currentuser.isAvatarImageSet)
      {
        const fetchContact=async()=>{
          const response=await axios.get(`http://localhost:9000/getAllContact/${currentuser._id}`)
          console.log(response.data)
          if(response.data.msg=="Users Found")
          {
            setContacts(response.data.users);
          }
          else{
            toast.error("Users Not Found")
          }
        }
        fetchContact();
      }
      else{
        navigate('/setAvatar')
      }
    }
    else{
      navigate('/')
    }
  },[] )

  const handlechange=(chat)=>{
    setCurrentchat(chat);
  }
  return (
      <FormContainer>
        <div className='container'>
          {
            currentchat==undefined?<Contact contacts={contacts} changechat={handlechange} check={true}/>:<Contact contacts={contacts} changechat={handlechange} check={false}/>
          }
          {
            currentchat==undefined?(
              <Welcome/>
            ):(
            <Chatcontainer currentchat={currentchat} socket={socket}/>)
          }
        </div>
        <ToastContainer/>
      </FormContainer>
      
    
  )
}

const FormContainer=styled.div`
  height:100vh;
  width:100vw;
  display:flex;
  flex-direction:column;
  justify-content:center;
  gap:1rem;
  align-items:center;
  background-color:#131324;
  .container{
    height:85vh;
    width:85vw;
    background-color:#00000076;
    display:grid;
    grid-template-columns:25% 75%;
    @media screen and (min-width:720px) and (max-width:1080px)
    {
      grid-template-columns:35% 65%;
    }
  }
`;
export default Chat