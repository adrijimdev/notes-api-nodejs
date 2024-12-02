const express = require('express'); //importación del módulo express.js
const app = express(); //crea una instancia de express donde se definirán las rutas
app.use(express.json()); //middleware que interpreta el cuerpo de las solicitudes como json

//para poder ejecutar el servidor local con node.js
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`servidor activo en puerto ${PORT}`);
});

let idCount = 1;
let noteList = [];

class Note {
    constructor(title, content) {
        this.id = idCount;
        idCount += 1;
        this.title = title;
        this.content = content;
        this.createdAt = new Date();
    }
}

app.post('/notes', (req, res) => {
    const { title, content } = req.body;

    const newNote = new Note(title, content);
    noteList.push(newNote);

    res.status(201).json(newNote);
});

//obtener todas las notas
app.get('/notes', (req, res) => {
    res.json(noteList);
});

//obtener nota concreta
app.get('/notes/:id', (req, res) => {
    const { id } = req.params;
    const note = noteList.find(n => n.id === parseInt(id));

    res.json(note); 
});

app.put('/notes/:id', (req, res) => {
    const { id } = req.params;
    const note = noteList.find(n => n.id === parseInt(id));
    const { title, content } = req.body;

    note.title = title;
    note.content = content;
    noteList.push(newNote);

    res.json(note);
});

app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    const noteIndex = noteList.findIndex(n => n.id === parseInt(id));

    noteList.splice(noteIndex, 1);

    res.status(204).send();
});