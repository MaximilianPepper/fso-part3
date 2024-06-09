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

// this currently doesnt work because it doesnt interact with db
app.get("/info", (request, response) => {
  const data = `Phonebook has info for ${
    persons.length
  } people <br/> ${new Date()}`;
  response.send(data);
  console.log("test");
});

// outdated
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);
  person ? response.json(person) : response.status(404).end();
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = Number(request.params.id);
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
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
