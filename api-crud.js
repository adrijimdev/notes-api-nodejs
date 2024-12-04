const mongoose = require('mongoose'); 
const express = require('express'); //importación del módulo express.js
require('dotenv').config();
const app = express(); //crea una instancia de express donde se definirán las rutas
app.use(express.json()); //middleware que interpreta el cuerpo de las solicitudes como json

const MONGO_URI = process.env.MONGO_URI;

//para poder ejecutar el servidor local con node.js
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`servidor activo en puerto ${PORT}`);
});

mongoose.connect(MONGO_URI)
    .then(() => console.log('Conexión correcta a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model('Note', noteSchema);

app.post('/notes', async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Tu nota debe tener título y contenido' });
        }
        
        const newNote = new Note({ title, content });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear la nota' });
    }
});

//obtener todas las notas
app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las notas' });
    }
});

//obtener nota concreta
app.get('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({ error: "No se encuentra la nota" })
        }

        res.json(note); 
    } catch {
        return res.status(500).json({ error: "Error obteniendo la nota"} )
    }
});

//modificar nota
app.put('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Tu nota debe tener título y contenido' });
        }
        
        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { title, content, updatedAt: new Date() },
            { new:true } //esto devuelve la nota actualizada
        );

        if(!updatedNote) {
            return res.status(404).json({ error: "No se encuentra la nota" })
        }
        
        res.json(updatedNote);
    } catch {
        return res.status(500).json({ error: "Error actualizando la nota"} )
    }
});

//eliminar nota
app.delete('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNote = await Note.findByIdAndDelete(id);
        if (!deletedNote) {
            return res.status(404).json({ error: 'No se encuentra la nota' });
        }
        res.status(204).send(); // Respuesta sin contenido
    } catch (error) {
        res.status(500).json({ error: 'Error eliminando la nota' });
    }
});