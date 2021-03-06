const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    let authToken = req.cookies.authToken
    let adminToken = req.cookies.adminToken
    let token = authToken
    let secret = process.env.TOKEN_SECRET

    if (adminToken) {
        token = adminToken
        secret = process.env.TOKEN_ADMIN_SECRET
    }

    if (!authToken && !adminToken) return res.status(400).send('Access Denied')

    try {
        const verified = jwt.verify(token, secret)
        req.user = verified
        next()
    } catch (err) {
        res.status(400).send('Invalid Token')
    }
}