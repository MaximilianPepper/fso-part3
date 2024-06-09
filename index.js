const express = require("express");
const app = express();
var morgan = require("morgan");
app.use(express.json());

morgan.token("param", (req, res, param) => {
  return req.params[param];
});
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

// Use Morgan middleware with the custom token
app.use(
  morgan(
    ":method :url :status :param[id] :res[content-length] - :response-time ms :body"
  )
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const data = `Phonebook has info for ${
    persons.length
  } people <br/> ${new Date()}`;
  response.send(data);
  console.log("test");
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);
  person ? response.json(person) : response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;
  const data = { id: getId(), name: name, number: number };

  if (!name || !number) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  const [people] = persons.map((person) => person.name.toLowerCase());

  if (people.includes(name.toLowerCase()))
    return response.status(400).json({ error: "name must be unique" });
  persons = persons.concat(data);
  response.json(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function getId() {
  return Math.floor(Math.random() * 123456);
}
