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
  response.json(data); // before was persons but it was adding the default 4 people
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function getId() {
  return Math.floor(Math.random() * 123456);
}
