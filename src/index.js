const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require("cors")
const cookieParser = require('cookie-parser')

require('dotenv/config')

//Import Routes
const userRoute = require('./routes/user')
const classesRoute = require('./routes/classes')

//Connect to DB
mongoose.connect(process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
    },
    () => console.log('Connected to DB!')
)

//Middlewares
app.use(cookieParser())
app.use(cors({ origin: 'http://172.22.144.1:3000', credentials: true }))
app.use(express.json())

//Route Middlewares
app.use('/user', userRoute)
app.use('/classes', classesRoute)

app.listen(process.env.PORT || 3001)