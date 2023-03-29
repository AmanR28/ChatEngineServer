import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import config from './config';
import authRouter from './routes/auth.routes';
import passport from 'passport';
import { stream } from './services/logger.services';
import mongoose from 'mongoose';

import './db';

const app = express();

app.use(bodyParser.json());

app.use(morgan('combined', { stream }));

app.use(passport.initialize());
require('./services/passport.services');

app.use('/auth', authRouter);

(async () => {
    await mongoose.connect(config.DB.MONGO_URI!, {
        keepAlive: true,
    });
})().catch(error => console.error(error));

app.listen(config.PORT, () => {
    console.log('Server is running on port ', config.PORT);
});
