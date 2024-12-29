const express=require('express');
const cors=require('cors');
const bodyParser= require('body-parser');

const posts= {};
const app= express();
app.use(bodyParser.json());
app.use(cors());
app.get('/posts',(req,res)=>{
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    if (!type || !data) {
        console.error('Received event with missing type or data:', req.body);
        return res.status(400).send({ error: 'Missing event type or data' });
    }

    try {
        if (type === 'Post Created') {
            const { id, title } = data;
            if (!id || !title) {
                console.error('Invalid data for Post Created:', data);
                return res.status(400).send({ error: 'Invalid data for Post Created' });
            }
            posts[id] = { id, title, comments: [] };
        }

        if (type === 'Comment Created') {
            const { id, content, postId } = data;
            const post = posts[postId];

            if (!post) {
                console.error(`Post with ID ${postId} not found for comment.`);
                return res.status(400).send({ error: `Post with ID ${postId} not found` });
            }

            if (!id || !content) {
                console.error('Invalid data for Comment Created:', data);
                return res.status(400).send({ error: 'Invalid data for Comment Created' });
            }

            post.comments.push({ id, content });
        }

        console.log(posts);
        res.status(200).send({ message: 'Event processed successfully' });

    } catch (error) {
        console.error('Error processing event:', error.message);
        res.status(500).send({ error: 'Error processing event' });
    }
});
app.listen(4002,()=>{
    console.log('Query Service started at port 4002');
});