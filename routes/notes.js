const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const note = require('../models/Note');

router.post('/', async (req, res) => {
    try {
        const { title, content, userId } = req.body;
        if (!title || !content || !userId) {
            return res.status(400).json({ error: 'La nota debe tener título, contenido y un userId' });
        }

        const newNote = new Note({ title, content, userId });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (error) {
        console.error('Error al crear la nota:', error);
        res.status(500).json({ error: 'Error al crear la nota' });
    }
});

//obtener todas las notas
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las notas' });
    }
});

//obtener todas las notas de un usuario concreto
router.get('/userNotes/:userId', async (req, res) => {
    try {
        //extraigo de la petición el userId y busco las notas cuyo valor userId coincida con el userId enviado en la petición
        const { userId } = req.params;
        const note = await Note.find({userId});

        if (!note) {
            return res.status(404).json({ error: "No se encuentran notas asociadas al usuario" })
        }

        res.json(note); 
    } catch {
        return res.status(500).json({ error: "Error obteniendo las notas"} )
    }
});

//obtener nota concreta
router.get('/:id', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

module.exports = router;