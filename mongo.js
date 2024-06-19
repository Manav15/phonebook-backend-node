// mongo file for adding entries to the DB
const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log('Give password as argument');
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.b2klxqw.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String
});

const PhoneAddress = mongoose.model("PhoneAddress", phonebookSchema);

const phone = new PhoneAddress({
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
});

phone.save().then((result) => {
    console.log("phone details saved")
    mongoose.connection.close()
});

// Phonebook.find({}).then(result => {
//     result.forEach(note => {
//         console.log('note', note)
//     })
//     mongoose.connection.close()
// });