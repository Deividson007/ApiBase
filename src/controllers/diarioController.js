const express = require('express');
const fs = require('fs');
const authMiddleware = require('../middlewares/auth');
const paths = require('../config/paths');

const router = express.Router();
router.use(authMiddleware);

router.post('/save', async (req, res) => {
    const data = new Date();
    const name = `daily_${data.getTime()}`;

    fs.writeFile(`${paths.pathDaily}/${name}.json`, JSON.stringify(req.body), (err) => {
        if (err)
            return res.status(400).send({ error: 'Erro ao gravar arquivo' });
        else
            res.send({
                ok: 'true'
            });
    });
});

module.exports = app => app.use('/daily', router);