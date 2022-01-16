const express = require('express');
const path = require('path');
const noteData = require('./db/db.json');
const uuid = require('uuid');

const app = express();
app.use(express.static('public'));
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => res.json(noteData));

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
