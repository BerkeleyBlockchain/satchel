const express = require('express');
const School = require('../models/School');
require('dotenv').config();

const router = express.Router();

router.get('/', async (req, res) => {
    const { address } = req.query;

    if (!address) {
        return res.status(400).json({
            address: 'Address not found',
        });
    }

    let school = {};
    try {
        school = await School.findOne({ address });
    } catch (e) {
        console.log(e);
        return res.status(500).send(e);
    }

    return res.status(200).json({ success: true, school });
});

router.get('/allSchools', async (req, res) => {
    let schools = [];
    try {
        schools = await School.find();
    } catch (e) {
        console.log(e);
        return res.status(500).send(e);
    }

    return res.status(200).json({ success: true, schools });
});

router.post('/createSchool', async (req, res) => {
    const { name, address } = req.body;

    if (!name) {
        return res.status(400).json({
            email: 'Name not found',
        });
    } else if (!address) {
        return res.status(400).json({
            address: 'Address not found',
        });
    }

    try {
        let newSchool = new School({ name, address });
        await newSchool.save();
    } catch (e) {
        console.log(e);
        return res.status(500).send(e);
    }

    return res.status(200).json({ success: true });
});

module.exports = router;
