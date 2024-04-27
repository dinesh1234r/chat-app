import React, { useEffect } from 'react';
import styled from 'styled-components'; 
import { useNavigate } from 'react-router-dom';
import Loader from '../assets/preview.gif';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react';
import axios from 'axios'
import {Buffer} from 'buffer'

function SetAvatar() {
  const navigate=useNavigate()
    const api='https://api.multiavatar.com/45678945';
    const [avatar,setAvatar]=useState([]);
    const [isLoading,setIsLoading]=useState(true);
    const [selectavatar,setSelectavatar]=useState(undefined );
    useEffect(()=>{
      if(!localStorage.getItem('userinfo'))
      {
        navigate('/')
      }
    },[])
    const setProfilepicture=async()=>{
         if(selectavatar==undefined)
         {
            toast.error("Please select an Avatar")
         }
         else
         {
            const user=JSON.parse(localStorage.getItem('userinfo'));
            
            const response=await axios.post(`https://chat-app-backend-nst9.onrender.com/setAvatar/${user._id}`,{
                image:avatar[selectavatar]
            },{headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          }})
            if(response.data.isSet)
            {
                user.isAvatarImageSet=true;
                user.avatarImage=response.data.image;
                localStorage.setItem('userinfo',JSON.stringify(user))
                navigate('/Chat')
            }
            else{
              toast.error("Please try again",{
                autoClose:200
              })
            }

         }
    }
    useEffect(()=>{
        const fetchAvatar=async()=>{
            try{
            const data=[]
            for(let i=0;i<4;i++)
            {
                const image=await axios.get(`${api}/${Math.round(Math.random()*100)}`);
                const buffer=new Buffer(image.data);
                data.push(buffer.toString("base64"))
            }
            setAvatar(data);
            setIsLoading(false);
        }catch(err)
        {
            toast.error(err);
        }
        }
        fetchAvatar();
        

    },[])
  return (
    <>
        {isLoading?<FormContainer>
            <img src={Loader} alt='Loader'/>
            </FormContainer>:
        <FormContainer>
        <h1>Pick an Avatar as your profile</h1>
            <div className='title-container'>
                
                <div className='avatars'>
                    {avatar.map((avatar,index)=>{
                       return (
                        <div key={index} className={`avatar ${selectavatar==index?"selected":""}`}>
                            <img src={`data:image/svg+xml;base64,${avatar}`} alt='avatar'
                            onClick={()=>setSelectavatar(index)}/>
                        </div>
                       ) 
                    })}
                </div>
            </div>
            <button className='submit-btn' onClick={setProfilepicture}>Set an avatar</button>
        </FormContainer>
        }
        <ToastContainer/>  
    </>
  )
}

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  h1 {
    color: white;
  }
  .loader {
    max-inline-size: 100%;
  }

  
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
        border: 0.4rem solid #4e0eff;
      }
  }
  .submit-btn {
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
export default SetAvatar