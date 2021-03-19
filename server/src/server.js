require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRouter = require('./routes/userRouter');
const schoolRouter = require('./routes/schoolRouter');
const projectRouter = require('./routes/projectRouter');

const port = process.env.PORT ? process.env.PORT : 4000;

mongoose.connect(process.env.MONGOOSE, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.once('open', () => {
    console.log('DB connected successfully!');
});
db.on('error', (err) => {
    console.error(`Error while connecting to DB: ${err.message}`);
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api/user/', userRouter);
app.use('/api/school/', schoolRouter);
app.use('/api/project/', projectRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

module.exports = { app };
