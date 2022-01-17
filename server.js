const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');
let noteData = require('./db/db.json');
const { CLIENT_RENEG_WINDOW } = require('tls');
const { del } = require('express/lib/application');

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
    noteData.push(newNote);
    fs.writeFile(
      path.join(__dirname, '/db/db.json'),
      JSON.stringify(noteData),
      err => (err ? console.log(err) : console.log('Note Saved'))
    );
    // fs.readFile(path.join(__dirname, 'db/db.json'), function (err, data) {
    //   let note = JSON.parse(data);
    //   note.push(newNote);

    //   fs.writeFile(
    //     path.join(__dirname, 'db/db.json'),
    //     JSON.stringify(note),
    //     err => (err ? console.log(err) : console.log('Note saved'))
    //   );
    // });
    res.status(201).json(newNote);
  } else {
    res.status(500).json({ err: 'Server error', msg: 'Note not posted' });
  }
});

app.delete('/api/notes/:id', (req, res) => {
  let delId = req.params.id;
  if (noteData.some(note => note.id == delId)) {
    // if (noteData.some(note => note.id == delId)) {
    let data = fs.readFileSync(path.join(__dirname, '/db/db.json'));
    let notes = JSON.parse(data);
    let filtered = notes.filter(note => note.id !== delId);
    fs.writeFile(
      path.join(__dirname, '/db/db.json'),
      JSON.stringify(filtered),
      err =>
        err
          ? console.log(err)
          : console.log(`Note with ID ${delId} was deleted`)
    );
  } else {
    console.log(`Note with ID ${delId} not found`);
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
