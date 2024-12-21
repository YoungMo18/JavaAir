import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session'

import models from './models.js'

import apiv1Router from './routes/api/v1/apiv1.js';
import apiv2Router from './routes/api/v2/apiv2.js';
import apiv3Router from './routes/api/v3/apiv3.js';

import usersRouter from './routes/api/v3/controllers/users.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import WebAppAuthProvider from 'msal-node-wrapper';

// const authConfig = {
//   auth: {
//       clientId: "4847ef4c-f1bd-4279-bad5-544fc04336d0",
//       authority: "https://login.microsoftonline.com/82fff65e-c740-4b82-88bf-f4e7739948d4",
//       clientSecret: "Qno8Q~rsrYdztyEZ~FbXo6LzDL~XbommRoanQaX.",
//       redirectUri: "/redirect"
//   },
//   system: {
//       loggerOptions: {
//           loggerCallback(loglevel, message, containsPii) {
//               console.log(message);
//           },
//           piiLoggingEnabled: false,
//           logLevel: 3,
//       }
//   }
// };



const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const __dirname = path.resolve();

var app = express();

app.enable('trust proxy')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../frontend/build')));

const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "this is some secret key I am making up 093u4oih54lkndso8y43hewrdskjf",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

app.use((req, res, next) => {
  req.models = models
  next()
})

app.use('/api/v1', apiv1Router);
app.use('/api/v2', apiv2Router);
app.use('/api/v3', apiv3Router);

// const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
// app.use(authProvider.authenticate());

app.use('/users', usersRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle React routing, return index.html for any unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// app.get('/signin', (req, res, next) => {
//     return req.authContext.login({
//         postLoginRedirectUri: "/", // redirect here after login
//     })(req, res, next);

// });
// app.get('/signout', (req, res, next) => {
//     return req.authContext.logout({
//         postLogoutRedirectUri: "/", // redirect here after logout
//     })(req, res, next);

// });
// app.use(authProvider.interactionErrorHandler());

// const port = normalizePort(process.env.PORT || '5000');
// app.set('port', port);


export default app;
