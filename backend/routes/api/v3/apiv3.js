import express from 'express';
var router = express.Router();

import postsRouter from './controllers/posts.js';
import usersRouter from './controllers/users.js';
import commentsRouter from './controllers/comments.js';
import flightsRouter from './controllers/flights.js';


router.use('/posts', postsRouter);
router.use('/users', usersRouter);
router.use('/comments', commentsRouter);
router.use('/flights', flightsRouter);

export default router;