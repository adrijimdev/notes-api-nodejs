const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const notesRoutes = require('./routes/notes');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
    .then(() => console.log('Conexión correcta a MongoDB'))
    .catch(err => console.error(`Error al conectar a MongoDB: `, err));

// Rutas
app.use('/notes', notesRoutes);
app.use('/users', usersRoutes);

app.listen(PORT, () => {
    console.log(`servidor activo en puerto ${PORT}`);
});