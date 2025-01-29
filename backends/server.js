import express from "express"
import mongoose from "mongoose"
import dotenv from 'dotenv';
import  repositoryRoute from './router/routerApp.js'
import bodyParser from 'body-parser'
dotenv.config();

const app = express()
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
console.log("🔍 dbURL:", process.env.MONGO_URL);

mongoose
.connect(process.env.dbURL, {
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
    // useFindAndModify:false,
     
})
.then(()=> {
    app.listen(port, () => console.log('server running...')),
    console.log('connected to mongoDB')
})
.catch(err => console.error("Mongodb connection error:", err))

app.use('/api', repositoryRoute);
