import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import config from './config';
import passport from 'passport';
import mongoose from 'mongoose';
import { currentUser, errorHandler } from './middlewares';
import { authRoutes, profileRoutes, connectionRoutes } from './routes';

import './db';

const app = express();

app.use(bodyParser.json());

app.use(morgan('combined'));

app.use(passport.initialize());
require('./services/passport.services');

app.use(currentUser);

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/connection', connectionRoutes);

app.use(errorHandler);

(async () => {
    await mongoose.connect(config.DB.MONGO_URI!, {
        keepAlive: true,
    });
})().catch(error => console.error(error));

app.listen(config.PORT, () => {
    console.log('Server is running on port ', config.PORT);
});
