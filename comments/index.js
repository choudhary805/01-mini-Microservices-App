const { randomBytes } = require("crypto");
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const commentsByPostId = {};

// Get comments for a specific post
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

// Create a comment for a post
app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];
    comments.push({ id: commentId, content, status: 'pending'});
    commentsByPostId[req.params.id] = comments;

    // Emit event to event bus
    try {
        await axios.post('http://localhost:4005/events', {
            type: 'Comment Created',
            data: {
                id: commentId,
                content,
                postId: req.params.id
            },
        });
    } catch (err) {
        console.error('Error emitting event:', err.message);
    }

    res.status(201).send(comments);
});

// Receive events from the event bus
app.post('/events', (req, res) => {
    try {
        console.log('Receiving event', req.body.type);
        res.send({});
    } catch (err) {
        console.error('Error processing event:', err.message);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(4001, () => {
    console.log("Listening on port 4001");
});
