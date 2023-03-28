require('dotenv').config();

let NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
    NODE_ENV,
    PORT: process.env.PORT || 3000,
    JWT_TOKEN: {
        SECRET_KEY: process.env.TOKEN_SECRET_KEY,
        EXPIRE_TIME: 2 * 60 * 60 * 1000, // 2H
    },
    GOOGLE: {
        CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        CALLBACK: 'http://localhost:3000/auth/google/callback',
    },
};

export default config;
