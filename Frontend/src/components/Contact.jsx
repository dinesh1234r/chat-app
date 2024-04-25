import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Logo from '../assets/logo.svg'
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';

function Contact({contacts,changechat,check}) {
  const [currentusername,setCurrentusername]=useState(undefined);
  const [currentuserImage,setCurrentuserImage]=useState(undefined);
  const [currentSelected,setCurrentSelected]=useState(undefined);
  const currentuser=JSON.parse(localStorage.getItem('userinfo'))
  
  // useEffect(()=>{
  //   if(currentuser)
  //   {
  //     setCurrentusername(currentuser.username);
  //     setCurrentuserImage(currentuser.avatarImage);
  //   }
  // },[currentuser]);
  const changeCurrentChat=async(index,contact)=>{
    setCurrentSelected(index);
    changechat(contact)
  }
  return (
    <>
      <FormContainer>
        <div className='brand'>
          <img src={Logo} alt='Logo Image'/>
          <h3>Chat-App</h3>
        </div>
        <div className="contacts">
          {contacts.map((contact,index)=>{
            return (
              <div className={`contact ${index==currentSelected?"selected":""}`} key={index} onClick={()=>changeCurrentChat(index,contact)}>
                <div className="avatar">
                <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt='avatar'/>
                </div>
                <div className="username">
                  <h3>{contact.username}</h3>
                </div>
              </div>
            )
          })}
        </div>
        <div className="current-user">
          <div className="avatar">
              <img src={`data:image/svg+xml;base64,${currentuser.avatarImage}`} alt='avatar'/>
          </div>
          <div className="username">
              <h2>{currentuser.username}</h2>
          </div>
          {
            check&&<Logout/>
          }
        </div>
        
      </FormContainer>
    </>
  )
}

const FormContainer=styled.div`
display: grid;
grid-template-rows: 10% 75% 15%;
overflow: hidden;
background-color: #080420;
.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  img {
    height: 2rem;
  }
  h3 {
    color: white;
    text-transform: uppercase;
  }
}
.contacts {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  gap: 0.8rem;
  &::-webkit-scrollbar {
    width: 0.2rem;
    &-thumb {
      background-color: #ffffff39;
      width: 0.1rem;
      border-radius: 1rem;
    }
  }
  .contact {
    background-color: #ffffff34;
    min-height: 5rem;
    cursor: pointer;
    width: 90%;
    border-radius: 0.2rem;
    padding: 0.4rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    transition: 0.5s ease-in-out;
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
  .selected {
    background-color: #9a86f3;
  }
}

.current-user {
  background-color: #0d0d30;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  .avatar {
    img {
      height: 4rem;
      max-inline-size: 100%;
    }
  }
  .username {
    h2 {
      color: white;
    }
  }
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    gap: 0.5rem;
    .username {
      h2 {
        font-size: 1rem;
      }
    }
  }
}
`;

export default Contact