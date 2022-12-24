const express = require('express');
const app = express();
app.use(express.json())

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons);
})

app.get('/info', (req, res) => {
    const dateOfRequest = new Date();
    res.send(`<p>Phonebook has info for ${persons.length} people.</p><p>${dateOfRequest}</p>`);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const personObj = persons.find(person => person.id === id);
    delete personObj.number;

    persons = persons.map(person => {
        return (person.id === id) ? personObj : person;
    });

    response.status(204).end();
})

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(p => p.id))
      : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number missing' 
        });
    }

    let isAlreadyInList = false;

    persons.map(person => {
        (person.name === body.name)
            ? isAlreadyInList = true
            : 0;
    });

    if (isAlreadyInList) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        });
    }

    console.log(isAlreadyInList);

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person);
    response.json(person);
})
  

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
