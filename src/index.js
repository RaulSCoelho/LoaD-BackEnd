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
        useUnifiedTopology: true,
    }
)

//Middlewares
app.use(cors({ origin: ['https://lifeofadream.vercel.app', 'http://localhost:3000'], credentials: true }))
app.use(express.json())
app.use(cookieParser())

//Route Middlewares
app.use('/user', userRoute)
app.use('/classes', classesRoute)

app.listen(process.env.PORT || 3001)