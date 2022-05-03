const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require("cors")
const cookieParser = require('cookie-parser')

require('dotenv').config()

//Import Routes
const userRoute = require('./routes/user')
const classesRoute = require('./routes/classes')
const chatRoute = require('./routes/chat')

//Connect to DB
mongoose.connect(process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
    },
    () => console.log('Connected to DB!')
)

//Middlewares
app.use(cookieParser())
app.use(cors({ origin: ['https://lifeofadream.vercel.app', 'http://localhost:3000', 'http://192.168.0.87:3000'], credentials: true }))
app.use(express.json())

//Route Middlewares
app.use('/user', userRoute)
app.use('/classes', classesRoute)
app.use('/chat', chatRoute)

app.listen(process.env.PORT || 3001)