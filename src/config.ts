require('dotenv').config();

let NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
    NODE_ENV,
    PORT: process.env.PORT || 3000,
};

export default config;
