import React, { useEffect, useState,useRef } from 'react'
import styled from 'styled-components'
import Logout from './Logout';
import { useNavigate } from 'react-router-dom';
import ChatInput from './ChatInput';
import axios from 'axios'
import {v4 as uuid} from 'uuid'

function Chatcontainer(props) {
  const user=JSON.parse(localStorage.getItem('userinfo'))
  const [message,setMessage]=useState([]);
  const [arrival,setArrival]=useState(null);
  const scrollRef=useRef();
  useEffect(()=>{
    if(props.currentchat)
    {
    const fetchmsg=async()=>{
      const response=await axios.post('http://localhost:9000/getAllmsg',{
        from:user._id,
        to:props.currentchat._id
      },{headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    }})
      setMessage(response.data);
    }
    fetchmsg();
    }
  },[props.currentchat])
  const handleSendmsg=async(msg)=>{
    const response=await axios.post("http://localhost:9000/addmsg",{
      from:user._id,
      to:props.currentchat._id,
      msg:msg
    },{headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
  }})
    props.socket.current.emit("send-msg",{
      to:props.currentchat._id,
      from:user._id,
      message:msg
    })
    const msgs=[...message];
    msgs.push({fromself:true,message:msg});
    setMessage(msgs);
  }
  useEffect(()=>{
    if(props.socket.current)
    {
      props.socket.current.on("msg-recieve",(msg)=>{
        setArrival({fromself:false,message:msg})
      })
    }
  })
  useEffect(()=>{
    arrival&& setMessage((prev)=>[...prev,arrival]);
  },[arrival])
  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behaviour:"smooth"});
  },[message])
  return (
    <FormContainer>
        <div className='chat-header'>
            <div className='user-details'>
                <div className="avatar">
                    <img src={`data:image/svg+xml;base64,${props.currentchat.avatarImage}`} alt='avatar'/>
                </div>
                <div className='username'>
                    <h3>{props.currentchat.username}</h3>
                </div>
            </div>
            <Logout/>
        </div>
        <div className="chat-messages">
          {
            message.map((msg)=>{
              return (
                <div ref={scrollRef} key={uuid()}>
                  <div className={`message ${msg.fromself?"sended":"received"}`}>
                    <div className='content'>
                      <p>{msg.message}</p>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
        <ChatInput handleSendmsg={handleSendmsg}/>
    </FormContainer>
  )
}

const FormContainer= styled.div`
display: grid;
grid-template-rows: 10% 80% 10%;
gap: 0.1rem;
overflow: hidden;
@media screen and (min-width: 720px) and (max-width: 1080px) {
  grid-template-rows: 15% 70% 15%;
}
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  .user-details {
    display: flex;
    align-items: center;
    gap: 1rem;
    .avatar {
      img {
        height: 3rem;
      }
    }
    .username {
      h3 {
        color: white;
      }
    }
  }
}
.chat-messages {
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0.2rem;
    &-thumb {
      background-color: #ffffff39;
      width: 0.1rem;
      border-radius: 1rem;
    }
  }
  .message {
    display: flex;
    align-items: center;
    .content {
      max-width: 40%;
      overflow-wrap: break-word;
      padding: 1rem;
      font-size: 1.1rem;
      border-radius: 1rem;
      color: #d1d1d1;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        max-width: 70%;
      }
    }
  }
  .sended {
    justify-content: flex-end;
    .content {
      background-color: #4f04ff21;
    }
  }
  .recieved {
    justify-content: flex-start;
    .content {
      background-color: #9900ff20;
    }
  }
}
`;

export default Chatcontainer