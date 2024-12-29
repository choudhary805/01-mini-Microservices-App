const express= require("express");
const bodyParser= require('body-parser');
const axios= require('axios');

const app= express();
app.use(bodyParser.json());

app.post('/events',(req,res)=>{
    const event = req.body;
 axios.post('http://localhost:4000/events',event).catch((err)=>{
    console.log('error in post service ',err.message);
 });
 axios.post('http://localhost:4001/events',event).catch((err)=>{
    console.log('error in comment service ',err.message);
 });
 axios.post('http://localhost:4002/events',event).catch((err)=>{
   console.log(event);
    console.log('error in query service ',err.message);
 });
    res.send({status:'OK'});
})

app.listen(4005,(req,res)=>{
    console.log('Evenet bus started successfully on port 4005');
 })