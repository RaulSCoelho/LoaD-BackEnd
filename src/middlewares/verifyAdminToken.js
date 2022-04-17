const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const adminToken = req.cookies.adminToken
    const secret = process.env.TOKEN_ADMIN_SECRET

    if (!adminToken) return res.status(400).send('Access Denied')

    try {
        const verified = jwt.verify(adminToken, secret)
        req.user = verified
        next()
    } catch (err) {
        res.status(400).send('Invalid Token')
    }
}