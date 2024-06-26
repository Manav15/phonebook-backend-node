//MongoDb config
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
    .then((result) => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    });

const phonebookSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
});

phonebookSchema.set('toJSON', {
    transform: (doc, returnedObject) => {
        delete returnedObject._id
        delete returnedObject._v
    }
});

module.exports = mongoose.model('PhoneAddress',phonebookSchema)