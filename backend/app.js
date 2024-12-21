import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session';

import models from './models.js';

import apiv1Router from './routes/api/v1/apiv1.js';
import apiv2Router from './routes/api/v2/apiv2.js';
import apiv3Router from './routes/api/v3/apiv3.js';

import usersRouter from './routes/api/v3/controllers/users.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import WebAppAuthProvider from 'msal-node-wrapper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve();

var app = express();

app.enable('trust proxy');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../frontend/build')));

const oneDay = 1000 * 60 * 60 * 24;
app.use(
    sessions({
        secret: "this is some secret key I am making up 093u4oih54lkndso8y43hewrdskjf",
        saveUninitialized: true,
        cookie: { maxAge: oneDay },
        resave: false,
    })
);

app.use((req, res, next) => {
    req.models = models;
    next();
});

app.use('/api/v1', apiv1Router);
app.use('/api/v2', apiv2Router);
app.use('/api/v3', apiv3Router);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
console.log('Static uploads path:', path.join(__dirname, '../uploads'));
// Catch-all route for React frontend (excluding /uploads explicitly)
app.get(/^\/(?!uploads).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

import fs from 'fs';

const filePath = path.join(__dirname, '../uploads/1734765996358-686388912-volcano.jpg');
fs.access(filePath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error('File does not exist:', filePath);
  } else {
    console.log('File exists:', filePath);
  }
});

// Uncomment if MSAL authentication is used
// const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
// app.use(authProvider.authenticate());

// Uncomment if user-specific routes are needed
// app.use('/users', usersRouter);

export default app;