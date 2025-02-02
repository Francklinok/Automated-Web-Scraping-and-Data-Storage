import express from "express"
import mongoose from "mongoose"
import dotenv from 'dotenv';
import  repositoryRoute from './router/routerApp.js'
import bodyParser from 'body-parser'
import cors from 'cors'
 // Loads environment variables from the .env file
dotenv.config();

const app = express()// Create an Express application instance
const port = process.env.PORT || 3000;// Set the port to either the environment variable or 3000


app.use(bodyParser.json());// Middleware to parse incoming JSON requests

console.log("🔍 dbURL:", process.env.dbURL);// Logs the DB URL (helpful for debugging)
// CORS middleware configuration to allow the frontend to make requests
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from the frontend URL
    methods: 'GET,POST,PUT,DELETE', // Allow these HTTP methods
    allowedHeaders: 'Content-Type,Authorization', // Allow these headers
  }));
  
  // Connect to MongoDB using Mongoose
mongoose
.connect(process.env.dbURL, {
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
    // useFindAndModify:false,
     
})
.then(()=> {
        // Once MongoDB is connected, start the server
    app.listen(port, () => console.log('server running...')),
    console.log('connected to mongoDB')
})
.catch(err => console.error("Mongodb connection error:", err))
// Use the repositoryRoute to handle requests starting with '/api'
app.use('/api', repositoryRoute);
