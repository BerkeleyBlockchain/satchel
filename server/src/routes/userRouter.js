const express = require('express');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

router.get('/', async (req, res) => {
    const { address } = req.query;

    if (!address) {
        return res.status(400).json({
            address: 'Address not found',
        });
    }

    let user = {};
    try {
        user = await User.findOne({ address });
    } catch (e) {
        console.log(e);
        return res.status(500).send(e);
    }

    return res.status(200).json({ success: true, user });
});

router.post('/createUser', async (req, res) => {
    const { name, school, address } = req.body;

    if (!name) {
        return res.status(400).json({
            email: 'Name not found',
        });
    } else if (!school) {
        return res.status(400).json({
            password: 'School not found',
        });
    } else if (!address) {
        return res.status(400).json({
            address: 'Address not found',
        });
    }

    try {
        let newUser = new User({ name, school, address });
        await newUser.save();
    } catch (e) {
        console.log(e);
        return res.status(500).send(e);
    }

    return res.status(200).json({ success: true });
});

module.exports = router;
