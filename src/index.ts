import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import config from './config';
import authRouter from './routes/auth.routes';
import passport from 'passport';

const app = express();

app.use(morgan('dev'));

app.use(bodyParser.json());

app.use(passport.initialize());
require('./services/passport.services');

app.use('/auth', authRouter);

app.listen(config.PORT, () => {
    console.log('Server is running on port ', config.PORT);
});
