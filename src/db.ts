import mongoose from 'mongoose';
import config from './config';

const connection = mongoose.connection;
connection.on('connected', () => {
    console.log('Mongo Connection Established');
});
connection.on('reconnected', () => {
    console.log('Mongo Connection Reestablished');
});
connection.on('disconnected', () => {
    console.log('Mongo Connection Disconnected');
    console.log('Trying to reconnect to Mongo ...');
    setTimeout(() => {
        mongoose.connect(config.DB.MONGO_URI!, {
            keepAlive: true,
            socketTimeoutMS: 3000,
            connectTimeoutMS: 3000,
        });
    }, 3000);
});
connection.on('close', () => {
    console.log('Mongo Connection Closed');
});
connection.on('error', (error: Error) => {
    console.log('Mongo Connection ERROR: ' + error);
});
