const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();


const temasRoutes = require('./routes/temas');

const bolosRoutes = require('./routes/bolos');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


app.use('/temas', temasRoutes);
app.use('/bolos', bolosRoutes);
app.use('/uploads', express.static('public/uploads'));

const PORT = process.env.PORT || 5100;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})