require('dotenv').config();
const mongoose = require('mongoose');
const validator = require('validator');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
    },
    targetFunding: {
        type: Number,
        required: true,
    },
    fundingBreakdown: {
        type: Array,
        required: true,
    },
    school: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEthereumAddress(value)) {
                throw new Error('Address is invalid');
            }
        },
    },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
