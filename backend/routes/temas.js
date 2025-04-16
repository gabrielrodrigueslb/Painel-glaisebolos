const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = Date.now() + ext;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

// Rota para cadastrar novo tema

router.post('/criar', upload.single('img'), async (req, res) => {
  const { name, color } = req.body;
  const img = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !color || !img) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  db.query(
    'INSERT INTO temas (name, color, img) VALUES (?, ?, ?)',
    [name, color, img],
    (err, result) => {
      if (err) {
        console.error('Erro ao inserir tema:', err);
        return res.status(500).json({ error: err.message });
      }
      res
        .status(201)
        .json({ message: 'Tema criado com sucesso', id: result.insertId });
    },
  );
});

router.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
