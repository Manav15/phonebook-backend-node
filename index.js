let phoneData = require("./data/phone-data");
const express = require("express");
const generateId = require("./utils/utils");
const cors =  require('cors');

const app = express();
var morgan = require('morgan');

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
app.use(morgan(function(tokens,req,res){
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
      ].join(' ')
}));

app.get('/api/persons', (req, res) => {
    res.send(phoneData);
    res.end()
});

app.get('/api/info', (req, res) => {
    const numberOfPeople = phoneData.length + 1;
    const currDate = new Date();
    res.send(`<p>Phonebook has info for ${numberOfPeople} people <br/> ${currDate} </p>`)
    res.end();
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const output = phoneData.find((person) => person.id === id);
    if (!output) {
        res.statusMessage = "Person doesn't exist";
        return res.status(400)
            .json({
                error: "Person Not Found"
            }).end()
    }
    res.send(output);
    res.end();
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const removedPerson = phoneData.find((person) => person.id === id);
    if (!removedPerson) {
        return res.status(400).json({ error: "Person doesn't exist" }).end()
    }
    phoneData = phoneData.filter((person) => person.id !== id)
    res.send(`Person with id : ${removedPerson.id} Removed`);
    res.end();
});

app.post('/api/persons',(req,res) => {
    const inputReq = req.body;
  
    const nameAlreadyExist = phoneData.find((person) =>  person.name.toLowerCase() === inputReq.name.toLowerCase());

    if(!inputReq.name && !inputReq.number) {
        return res.status(400).send("Bad Request")
    } 
    
    if(!inputReq.name || !inputReq.number) {
        const errorMsg = !inputReq.name ? "name is missing" : "number is missing"
        return res.status(400).json({error: errorMsg}).end()
    } 

    if(nameAlreadyExist) {
        return res.status(400).json({error: "name must be unique"})
    }

    const person = {
        id: generateId(phoneData),
        name: inputReq.name,
        number: inputReq.number
    }

    phoneData = phoneData.concat(person);
    res.json(person)
    res.end()
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`App is running on Port ${PORT}`)
})