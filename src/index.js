const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require("cors")
require('dotenv/config')
//Import Routes
const authRoute = require('./routes/auth')
const classesRoute = require('./routes/classes')

//Middlewares
app.use(cors())
app.use(express.json())

//Route Middlewares
app.use('/user', authRoute)
app.use('/classes', classesRoute)

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
    console.log('connected to DB http://localhost:3000/')
)

app.listen(3001)