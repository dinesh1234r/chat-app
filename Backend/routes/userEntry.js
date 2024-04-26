const express = require('express');
const route = express.Router();
const userSchema = require('../modules/usermodel');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const msgSchema = require('../modules/messageModel');
const verifyToken=require('../Middleware/Authentication')
require('dotenv').config();

route.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const uservalid = await userSchema.findOne({ username })
        if (uservalid) {
            return res.json({
                msg: "Username Already exists"
            });
        }
        const emailvalid = await userSchema.findOne({ email })
        if (emailvalid) {
            return res.json({
                msg: "Email Already exists"
            });
        }
        const hashed = await bcrypt.hash(password, 10);
        const newUser = new userSchema({
            username,
            email,
            password: hashed
        });
        await newUser.save();
        return res.json({
            msg: "Registered successfully"
        });
    } catch (err) {
        return res.json({
            msg: "Error Occurred"
        });
    }
});

route.post('/login',async(req,res)=>{
    const {username,email,password}=req.body;
    const user=await userSchema.findOne({username})
    if(user)
    {
        const comparepass=await bcrypt.compare(password,user.password);
        if(!comparepass)
        {
            return res.json({
                msg:"Invalid Password"
            })
        }
        else{
            const secretkey=process.env.USER_SECRET_KEY;
            const token=jwt.sign({username:user.username},secretkey);
            const result={
                user:user,
                msg:"Login Successfully",
                token:token
            }
            return res.json(result);
        }
    }
    else{
        res.json(
            {
                msg:"Invalid username"
            }
        )
    }
})

route.post('/setAvatar/:id',verifyToken,async(req,res)=>{
     try{
        const userID=req.params.id;
        const user=await userSchema.findOneAndUpdate({_id:userID},{
            isAvatarImageSet:true,
            avatarImage:req.body.image
        })
        if(user)
        {
            return res.json({
                isSet:user.isAvatarImageSet,
                image:user.avatarImage
            })
        }
        return res.json({
            isSet:false,
            msg:"User does not exist"
        })
     }
     catch(err)
     {
        return res.json({
            isSet:false,
            msg:"Error Occurred in setAvatar"
        })
     }
})

route.get('/getAllContact/:id',verifyToken,async(req,res)=>{
    try{
        const users=await userSchema.find({_id:{$ne:req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id"
        ]);
        if(users.length!=0)
        {
            res.json(
                {
                    msg:"Users Found",
                    users:users
                }
            );
        }
        else
        {
            res.json({msg:"No Users Found"})
        }
    }
    catch(err)
    {
        res.json({
            msg:"Error Occurred in GetAllContacts"
        })
    }
})

route.post('/addmsg',verifyToken, async (req, res) => {
    try {
        const { from, to, msg } = req.body;
        
        const msgsent = new msgSchema({
            message: {text:msg},
            users: [from, to],
            sender: from,
        });
        
        await msgsent.save();
        return res.json({
            msg: "Message sent successfully."
        });
    } catch (err) {
        return res.json({
            msg:"Error Occurred in Message Sent"
        })
    }
});

route.post('/getAllmsg',verifyToken,async(req,res)=>{
    try{
        const {from,to}=req.body;
        const messages=await msgSchema.find({
            users:{
                $all:[from,to]
            }
        }).sort({updateAt:1})
        const projectmessage=messages.map((msg)=>{
            return {
                fromself:msg.sender.toString()==from,
                message:msg.message.text
            }
        })
        if(projectmessage)
        {
            res.json(projectmessage)
        }
        else{
            res.json({fromself:"user data not found"})
        }
    }
    catch(err)
    {
        res.json({
            fromself:"Data Not Found"
        })
    }
})

module.exports = route;
