const express = require("express");
const path = require("path");

const notes = require("./Develop/db/db.json");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
let noteId = notes.length;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Develop/public")));

//1st req for the main page of note taker index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "Develop/db/db.json"));
});

app.post("/api/notes", (req, res) => {
  let postData = req.body;
  postData.id = noteId + 1;
  noteId++;
  notes.push(postData);
  fs.writeFile("./Develop/db/db.json", JSON.stringify(notes), (err) => {
    if (err) throw err;
  });
  res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
});
app.delete("/api/notes/:id", (req, res) => {
  const allNotes = fs.readFile("./develop/db/db.json", (err, data) => {
    if (err) throw err;
    let alNotes = JSON.parse(data);
    let oneNote = alNotes.find(
      (note) =>
        // console.log(note.id === +req.params.id);
        note.id === +req.params.id
    );
    let indexOfOneNote = alNotes.indexOf(oneNote);
    alNotes.splice(indexOfOneNote, 1);

    fs.writeFile("./Develop/db/db.json", JSON.stringify(alNotes), (err) => {
      if (err) throw err;
    });

    res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
  });
});

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
