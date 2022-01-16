const express = require('express');
const path = require('path');
const fs = require('fs');
const noteData = require('./db/db.json');
// const uuid = require('uuid');

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
      id: 2,
    };
    console.log(newNote);
    fs.readFile(path.join(__dirname, 'db/db.json'), function (err, data) {
      let note = JSON.parse(data);
      note.push(newNote);
      fs.writeFile(
        path.join(__dirname, 'db/db.json'),
        JSON.stringify(note),
        err => console.log(err)
      );
    });
    // fs.appendFile(
    //   path.join(__dirname, 'db/db.json'),
    //   JSON.stringify(newNote),
    //   err => console.log(err)
    // );
  } else {
    res.statusMessage(500).json('Server Error in posting note');
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
