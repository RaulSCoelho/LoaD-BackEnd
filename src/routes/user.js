const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { registerValidation } = require('../validation')
const auth = require('../middlewares/verifyToken')
const adminAuth = require('../middlewares/verifyAdminToken')

//Register a user
router.post('/register', adminAuth, async (req, res) => {
    //Validate user
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //Check if the user is already in the DB
    const emailExist = await User.findOne({ email: req.body.email })
    const usernameExist = await User.findOne({ username: req.body.username })
    if (emailExist) return res.status(400).send('Email already exists')
    if (usernameExist) return res.status(400).send('Username already exists')

    //Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        username: req.body.username,
        email: req.body.email.toLowerCase(),
        fullname: req.body.fullname,
        password: hashedPassword,
        admin: req.body.admin
    })
    try {
        const savedUser = await user.save()
        res.send({ user: savedUser._id })
    } catch (err) {
        res.status(400).send(err)
    }
})

//Login
router.post('/login', async (req, res) => {
    //Check if the user is already in the DB
    const user = await User.findOne({ username: req.body.username })
    if (!user) return res.status(400).send('Invalid username or password')
    //Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Invalid username or password')

    //Create and assign a token
    if (user.admin) {
        const token = jwt.sign({ user: user }, process.env.TOKEN_ADMIN_SECRET, {
            expiresIn: 108000,
        })

        res.cookie('adminToken', token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        }).send("Logged In")
    } else {
        const token = jwt.sign({ user: user }, process.env.TOKEN_SECRET, {
            expiresIn: 108000,
        })

        res.cookie('authToken', token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        }).send("Logged In")
    }
})

//Logout
router.get('/logout', (req, res) => {
    res.cookie('adminToken', "", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    }).cookie('authToken', "", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    }).send("Logged Out")
})

//Get all the users
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (err) {
        res.status(400).send(err)
    }
})

//Get user by Username
router.get('/:username', auth, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
        res.send(user)
    } catch (err) {
        res.status(400).send(err)
    }
})

//Update a user
router.patch('/update/:username', adminAuth, async (req, res) => {
    try {
        const updatedUser = await User.updateMany({ username: req.params.username }, req.body)
        res.send(updatedUser)
    } catch (err) {
        res.status(400).send(err)
    }
})

//Delete a user
router.delete('/delete/:username', adminAuth, async (req, res) => {
    try {
        const removedUser = await User.remove({ username: req.params.username })
        res.send(removedUser)
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router