const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const userSignupPage = async(req,res)=>{
    try {
        console.log()
        
    } catch (error) {
        console.log(error)
    }
}

const userSignup = async(req,res)=>{
    try {
        
        const {name,email,password} = req.body;
        const emailExist = await User.findOne({email:email})
        if(emailExist){
            res.send("email already exist")
        }else{
            const hashPassword = await bcrypt.hash(password,12)
            const user = new User({
                name,
                email,
                password:hashPassword
            })
            await user.save();
        }
        res.send("registred")
        
    } catch (error) {
        console.log(error)
    }
}

const userLogin = async(req,res,next)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email})
        if(!user){
            res.send('incorrect email')
        }else{
            const isMatch = await bcrypt.compare(password,user.password)
            if(!isMatch){
                res.send("incorrect Password")
            }else{
                const token = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{
                    expiresIn:"30s"
                })
                res.cookie(String(user._id), token, {
                    path: '/',
                    expires: new Date(Date.now() + 1000 * 30),
                    httpOnly:true,
                    sameSite: 'lax'
                });

                return res.status(200).json({message:'successfully logged in',user,token})
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const verifyToken = async(req,res,next)=>{
    const cookies = req.headers.cookie;
    const token = cookies.split("=")[1];
    console.log(token)
    
   
    
    if(!token){
        res.status(404).json({message:"no token found"})
    }
     jwt.verify(String(token),process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err) {
            return res.status(400).json({message:"Invalid Token"})
        }
      
        req.id = user.id;

    });
    next();
}

const getUser = async(req,res,next)=>{
    try {
        const userId = req.id;
        const user = await User.findById(userId,"-password")
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        return res.status(200).json({user})

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    userSignup,
    userLogin,
    userSignupPage,
    verifyToken,
    getUser
}