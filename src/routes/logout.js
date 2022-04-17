const router = require('express').Router()

//Logout
router.get('/', (req, res) => {
    res.send("Logged Out")
})