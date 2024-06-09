// command line db es 3.12

const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");

const password = process.argv[2];
const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

// argv logic

if (process.argv.length === 3) {
  Person.find({}).then((persons) => {
    persons.forEach((person) => console.log(person.name + " " + person.number));
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });
  person.save().then((result) => {
    console.log("person saved!");
    mongoose.connection.close();
  });
} else {
  console.log("usage: node mongo.js password name number");
  process.exit(1);
}
// non-argv code commented out
/*const person = new Person({
  name: "Max",
  number: "331-9933333",
});

person.save().then((result) => {
  console.log("person saved!");
  mongoose.connection.close();
}); */
