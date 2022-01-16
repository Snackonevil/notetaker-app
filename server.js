const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const noteData = require('./db/db.json');
const { runInNewContext } = require('vm');

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

app.post('/api/notes', (req, res) => {
  console.log('Received post request');

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    console.log(newNote);

    fs.readFile(path.join(__dirname, 'db/db.json'), function (err, data) {
      let note = JSON.parse(data);
      note.push(newNote);

      fs.writeFile(
        path.join(__dirname, 'db/db.json'),
        JSON.stringify(note),
        err => (err ? console.log(err) : console.log('Note saved'))
      );
    });
    res.status(201);
  } else {
    res.status(500).json('Server Error in posting note');
  }
});

app.delete('/api/notes/:id', (req, res) => {
  let delId = req.params.id;
  fs.readFile(path.join(__dirname, './db/db.json'), (err, data) => {
    let noteData = JSON.parse(data);
    if (noteData.some(note => note.id == delId)) {
      let filtered = noteData.filter(note => note.id !== delId);
      fs.writeFile(
        path.join(__dirname, '/db/db.json'),
        JSON.stringify(filtered),
        err =>
          err ? console.log(err) : console.log(`Note with ID ${delId} deleted`)
      );
    } else {
      console.log(`Note with ID ${delId} not found`);
    }
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
