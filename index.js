require('dotenv').config();
const express = require("express");
const generateId = require("./utils/utils");
const cors = require('cors');
var phoneData = require("./data/phone-data");
var morgan = require('morgan');
const mongoose = require('mongoose')
const app = express();

const PhoneAddress = require('./models/phonebook');

//for static UI rendering
app.use(express.static('dist'))

//Adding cors
app.use(cors());

//using json parser
app.use(express.json());

//using morgan middleware
//predefined Morgan config
// app.use(morgan('tiny'));

//custom morgan config with logging HTTP post requests.
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}));

//api modified to get data from DB
app.get('/api/persons', (req, res) => {
    PhoneAddress.find({})
        .then(person => {
            res.json(person)
        })
});

app.get('/api/info', (req, res) => {
    const numberOfPeople = phoneData.length + 1;
    const currDate = new Date();
    res.send(`<p>Phonebook has info for ${numberOfPeople} people <br/> ${currDate} </p>`)
    res.end();
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    PhoneAddress.find({ id: id })
        .then((data) => {
            if (data) {
                res.json(data);
            } else {
                res.status(400).json({
                    error: "Person Not Found"
                }).end()
            }
        }).catch((err) => {
            console.log('error:', err)
            res.status(500).end()
        })
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    PhoneAddress.deleteOne({id: id})
    .then((deleted) => {
        console.log('deleted',deleted)
        res.status(200).send(`Person with id : ${id} Removed`).end()})
    .catch((err) =>  next(err));
});

app.put('/api/persons/:id',(req,res) => {
    const id= req.params.id;
    const body  = req.body;

    const updatedObj = {
        id: req.params.id,
        name: body.name,
        number: body.number
    };

    PhoneAddress.findOneAndUpdate({id: id},updatedObj)
    .then((result) => res.status(200).json(result).end())
    .catch((err) => next(err))
});

app.post('/api/persons', (req, res) => {
    const inputReq = req.body;

    if (inputReq === undefined) {
        return res.status(400).json({ error: 'content missing' })
    };

    const person = new PhoneAddress({
        id: generateId(phoneData),
        name: inputReq.name,
        number: inputReq.number
    });

    person.save().then((data) => res.json(data))
        .catch((error) => console.log('Error:', error))
});

//unknown endpoint middleware
const unknownEndpoint = (req,res) => {
    res.status(404).send({error: 'Unknown Endpoint'})
}

app.use(unknownEndpoint);

//Defining error handler middleware
const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformed id" })
    }

    next(error)
};

//Using error handler Middleware should be done at the end after all requests / routes and after all middlewares
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`App is running on Port ${PORT}`)
})