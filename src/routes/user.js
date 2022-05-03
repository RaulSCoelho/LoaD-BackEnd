const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { registerValidation, patchValidation } = require('../validateUser')
const auth = require('../middlewares/verifyToken')
const adminAuth = require('../middlewares/verifyAdminToken')

//Register a user
router.post('/register', adminAuth, async (req, res) => {
    //Validate user
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //Check if the user is already in the DB
    const usernameExist = await User.findOne({ username: req.body.username })
    if (usernameExist) return res.status(400).send('Username already exists')

    //Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        username: req.body.username,
        fullname: req.body.fullname,
        email: req.body.email,
        sex: req.body.sex,
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
            expiresIn: 86400 * 365, // 1 Year
        })

        res.cookie('adminToken', token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 86400 * 365 * 1000, // 1 Year
        }).send("Logged In")
    } else {
        const token = jwt.sign({ user: user }, process.env.TOKEN_SECRET, {
            expiresIn: 108000, // 1 Year
        })

        res.cookie('authToken', token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 86400 * 365 * 1000, // 1 Year
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

//Get user by Id
router.get('/id/:id', auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
        res.send(user)
    } catch (err) {
        res.status(400).send(err)
    }
})

//Update a user
router.patch('/:username', auth, async (req, res) => {
    const tokenInfo = req.user

    if (tokenInfo.user.username != req.params.username && !tokenInfo.user.admin) return res.status(400).send('Access Denied')

    //Validate user
    const { error } = patchValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    
    //Check if the user is already in the DB
    const emailExist = await User.findOne({ email: req.body.email })
    const usernameExist = await User.findOne({ username: req.body.username })
    if (emailExist) return res.status(400).send('Email already exists')
    if (usernameExist) return res.status(400).send('Username already exists')

    if (req.body.password) {
        //Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        req.body.password = hashedPassword
    }

    try {
        await User.updateMany({ username: req.params.username }, req.body)
        res.send("User updated with success")
    } catch (err) {
        res.status(400).send(err)
    }
})

//Delete a user
router.delete('/:username', adminAuth, async (req, res) => {
    try {
        const removedUser = await User.remove({ username: req.params.username })
        res.send("User deleted with success")
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router