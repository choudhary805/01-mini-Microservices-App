const express=require('express');
const { randomBytes } = require('crypto');
const bodyParser=require('body-parser');
const axios = require('axios');
const app= express();
app.use(bodyParser.json());
const posts={};
app.get('/posts',(req,res)=>{
    res.send(posts);
});
app.post('/posts',async(req,res)=>{
    const id= randomBytes(4).toString('hex');
    const { title } = req.body;
    
    posts[id]={
        id,title
    };

    //emit event to event bus
    await axios.post('http://localhost:4005/events',{
        'type':'Post Created',
        'data':{
            id,title
        }
    });
    res.status(201).send(posts[id]);
});

// receiving event from event bus
app.post('/events',(req,res)=>{
    console.log('Receiving event',req.body.type);
    res.send({});
});
app.listen(4000,()=>{
    console.log('Listening on 4000');
})