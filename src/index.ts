import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

app.use(cors({
    credentials: true
}))

app.use(cookieParser());
app.use(compression());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server is running on port 8080')
})

const MONGO_URL = 'mongodb+srv://pulley06arc:YACwAEGTAHeyhtCM@backenddb.oaeyx5c.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB'

mongoose.Promise = Promise
mongoose.connect(MONGO_URL)
mongoose.connection.on('error', (err: Error) => console.error(err))