require("dotenv").config();
const Person = require("./models/persons");
const express = require("express");
const app = express();
var morgan = require("morgan");
const cors = require("cors");

app.use(cors());
app.use(express.json());
// middleware for frontend
app.use(express.static("dist"));

morgan.token("body", (req, res) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});
app.use(
  morgan(":method :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  Person.countDocuments({})
    .then((amount) =>
      response.send(`Phonebook has info for ${amount}
  ${amount === 1 ? "person" : "people"} <br/> ${new Date()}`)
    )
    .catch((error) => next(erorr));
});

// search for id (either manually or go /request/find_id.rest to test)
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) =>
      person ? response.json(person) : response.status(404).end()
    )
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((res) => response.status(204).end())
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body;
  const person = new Person({ name: name, number: number });
  if (!name || !number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  person
    .save()
    .then((newPerson) => response.json(newPerson))
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedP) => response.json(updatedP))
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
