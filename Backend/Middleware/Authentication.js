const jwt=require('jsonwebtoken')

const verifyToken=async(req,res,next)=>{
    const authtoken=req.headers['authorization'];
    const token=authtoken&&authtoken.split(' ')[1];
    if(token)
    {
        const secretKey=process.env.USER_SECRET_KEY;
        jwt.verify(token,secretKey,(err,user)=>{
            if(err)
            {
                res.json({msg:"Token not verified"});
            }
            else{
                next();
            }
        })
    }
}

module.exports=verifyToken;