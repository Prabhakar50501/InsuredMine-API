const express = require('express')
const body_parser = require('body-parser')
const userModel = require('./models/userModel')
require('dotenv').config()

const PORT = process.env.PORT;

app = express()

// middlewares
app.use(body_parser.urlencoded({extended: false}))
app.use(body_parser.json())

// services

// GET: root
app.get('/', (req, res) => {
    res.send({result: 'OK'});
});

// POST: create user
app.post('/api/v1/user/create', (req, res) => {
    const body = req.body || false;
    if (!body) {
        return res.badRequest("Missing params: (body)");
    }
    const firstname = body.firstname || false;
    const account_name = body.account_name || false;
    const city = body.city || false;
    const account_type = body.account_type || false;
    const gender = body.gender || false;
    const email = body.email || false;
    const user = {
        firstname: firstname,
        account_name: account_name,
        city: city,
        gender: gender,
        account_type: account_type,
        email: email
    }

    userModel.create(user).then((userDoc) => {
        return res.send({result: 'User created successfully.'})
    }).catch(error => {
        console.log('error: ', error);
        return res.status(403).send({result: 'User created successfully.'})
    })
})

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}/`);
})