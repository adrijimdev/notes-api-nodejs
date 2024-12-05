const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Tu usuario debe tener nombre y contraseña' });
        }
        
        const newUser = new User({ username, password });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
});

//obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
});

//obtener usuario concreto
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: "No se encuentra el usuario" })
        }

        res.json(user); 
    } catch {
        return res.status(500).json({ error: "Error obteniendo el usuario"} )
    }
});

//modificar usuario
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Tu usuario debe tener nombre y contraseña' });
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, password},
            { new:true }
        );

        if(!updatedUser) {
            return res.status(404).json({ error: "No se encuentra el usuario" })
        }
        
        res.json(updatedUser);
    } catch {
        return res.status(500).json({ error: "Error actualizando el usuario"} )
    }
});

//eliminar usuario
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'No se encuentra el usuario' });
        }
        res.status(204).send(); // Respuesta sin contenido
    } catch (error) {
        res.status(500).json({ error: 'Error eliminando el usuario' });
    }
});

module.exports = router;