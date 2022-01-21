// Import modules
const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

// Import JSON file functiong as database
let noteData = require("./db/db.json");

// Initialize express
const app = express();
// Serve static folder 'public'
app.use(express.static("public"));
// json parsing middleware
app.use(express.json());

// Database path for convenience
const dbPath = path.join(__dirname, "/db/db.json");

// PORT variable in production and development environments
const PORT = process.env.PORT || 3000;

// GET request
// Sends index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// GET request
// Sends notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// GET request
// Sends json data from database
app.get("/api/notes", (req, res) => res.json(noteData));

// POST request
// Add new note to database
app.post("/api/notes", (req, res) => {
    console.log("Received post request");

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        noteData.push(newNote);
        fs.writeFileSync(dbPath, JSON.stringify(noteData), err =>
            err ? console.log(err) : console.log("Note Saved")
        );

        res.status(201).json(newNote);
    } else {
        res.status(500).json({ err: "Server error", msg: "Note not posted" });
    }
});

// DELETE request
// Remove json object from database by ID
app.delete("/api/notes/:id", (req, res) => {
    let delId = req.params.id;
    if (noteData.some(note => note.id == delId)) {
        const filtered = noteData.filter(note => note.id !== delId);
        fs.writeFileSync(dbPath, JSON.stringify(filtered), err =>
            console.log(err)
        );
        noteData = filtered;
        res.status(202).json({ Message: `Note with ID ${delId} deleted` });
    } else {
        res.status(404).json({ Message: `Note with ID ${delId} not found` });
        console.log(`Note with ID ${delId} not found`);
    }
});

// Initialize server
app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
