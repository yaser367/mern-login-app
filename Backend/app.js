require('dotenv').config();
const express = require('express')
const cors = require('cores')
const mongoose = require('mongoose')
const router = require('./routes/user-route')
const cookieParser = require('cookie-parser')

const app = express();

app.use(express.json()) 
app.use(express.urlencoded({extended:false}))

app.use(cookieParser())

app.use('/',router);


mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://yaser:HppF6Uf6pJTtz69h@cluster0.mzihx09.mongodb.net/Mern-Login?retryWrites=true&w=majority').then(()=>{
    app.listen(5000);
    console.log("listening...")
}).catch((err)=>{
    console.log(err)
})







//HppF6Uf6pJTtz69h