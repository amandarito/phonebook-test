const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

morgan.token('body', function (req, res) {
  const body = JSON.stringify(req.body)
  return body == '{}' ? ' ' : body
})

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]

const generateID = () => {
  return Math.floor(Math.random() * 99999)
}

app.get('/', (req, res) => {
  res.send('<h1>hello world</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).json({
      error: 'id not found'
    })
  }
})

app.get('/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}</p>
    `)
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.number || !body.name) {
    return res.status(400).json({
      error: 'missing name or number'
    })
  }

  if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateID(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
