const express = require('express');
const User = require('../models/User');
const axios = require('axios');
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

router.get('/getTokenPrices', async (req, res) => {
    const { tokens } = req.query;
    if (!tokens) {
        return res.status(400).json({
            tokens: 'Tokens not found',
        });
    }

    const prices = await axios.get(
        'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
        {
            params: {
                symbol: tokens,
            },
            headers: {
                'X-CMC_PRO_API_KEY': process.env.PRICES_API,
            },
        }
    );

    return res.status(200).json({ ...prices.data });
});

module.exports = router;
