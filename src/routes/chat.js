const express = require('express')
const router = express.Router()
const Chat = require('../models/Chat')
const User = require('../models/User')
const auth = require('../middlewares/verifyToken')
const adminAuth = require('../middlewares/verifyAdminToken')
const { addMessageValidation } = require('../validateChat')

router.get('/', auth, async (req, res) => {
    try {
        const messages = await Chat.find()
        res.send(messages)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/', auth, async (req, res) => {
    //Validate message
    const { error } = addMessageValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //Check if the user is valid
    const user = await User.findOne({ username: req.body.user.username })
    if (!user) return res.status(400).send('Username not found')

    const message = new Chat({
        message: req.body.message,
        user: req.body.user,
        day: req.body.day,
        time: req.body.time,
    })

    try {
        const savedMessage = await message.save()
        res.send(savedMessage)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.patch('/:_id', adminAuth, async (req, res) => {
    try {
        const updatedMessage = await Chat.updateMany({ _id: req.params._id }, req.body)
        res.send("Message updated with success")
    } catch (err) {
        res.status(400).send(err)
    }
})

router.delete('/:_id', auth, async (req, res) => {
    //Check if the message is valid
    const message = await Chat.findOne({ _id: req.params._id })
    if (!message) return res.status(400).send('Message not found')

    const tokenInfo = req.user

    if (tokenInfo.user.username != message.user.username && !tokenInfo.user.admin) return res.status(400).send('Access Denied')

    try {
        const removedMessage = await Chat.remove({ _id: req.params._id })
        res.send("Message deleted with success")
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router