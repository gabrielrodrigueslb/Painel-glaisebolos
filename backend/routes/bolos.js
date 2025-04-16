const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../../uploads/cakes'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const name = Date.now() + ext;
        cb(null, name);
    }
});
const upload = multer({ storage});

router.post('/criar', upload.single('img'), async (req, res) => {
    const {tema, medidas, pessoas, acabamento} = req.body;
    const img = req.file ? `/uploads/cakes/${req.file.filename}` : null;

    if(!tema || !medidas || !pessoas || !acabamento) {
        return res.status(400).json({error: 'Preencha todos os campos'});
    }

    try{
        let temaId;
        const [temaResult] = await db.promise().query('SELECT id FROM temas WHERE LOWER(name) = ?', [tema])

        if(temaResult.length > 0) {
            temaId = temaResult[0].id;
        } else{
            //cria novo tema com uma cor padrão
            const [insertResult] = await db.promise().query('INSERT INTO temas (name, color, img) VALUES (?, ?, ?)', [tema.trim() , '#814827', null]

            );
            temaId = insertResult.insertId;
        }

        //cria o bolo
        await db.promise().query('INSERT INTO bolos (img, tema_id, medidas, pessoas, acabamento) VALUES (?, ?, ?, ?, ?)', [
            img,
            temaId,
            medidas,
            pessoas,
            acabamento
        ]);
        res.status(201).json({message: 'Bolo criado com sucesso'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Erro ao cadastrar o bolo'});
    }
});

module.exports = router;
