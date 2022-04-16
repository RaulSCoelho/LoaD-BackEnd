const express = require('express')
const router = express.Router()
const Module = require('../models/Module')
const auth = require('../middlewares/verifyToken')
const adminAuth = require('../middlewares/verifyAdminToken')

router.get('/', auth, async (req, res) => {
    try {
        const modules = await Module.find()
        res.send({modules: modules, user: req.user})
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get('/:module', auth, async (req, res) => {
    try {
        const module = await Module.findOne({ module: req.params.module })
        res.send(module)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/', adminAuth, async (req, res) => {
    const module = new Module({
        module: req.body.module,
        videos: req.body.videos,
        titles: req.body.titles,
        thumbnails: req.body.thumbnails
    })
    try {
        const savedModule = await module.save()
        res.send(savedModule)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.patch('/:module', adminAuth, async (req, res) => {
    try {
        const updatedModule = await Module.updateMany({ module: req.params.module }, req.body)
        res.send(updatedModule)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.delete('/:module', adminAuth, async (req, res) => {
    try {
        const removedModule = await Module.remove({ module: req.params.module })
        res.send(removedModule)
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router