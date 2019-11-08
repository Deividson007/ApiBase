const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');
const user = require('../models/user');

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 6000
    });
}

router.post('/register', async (req, res) => {
    const { email } = req.body;
    try {
        if (await user.verificaExisteEmail({ email }))
            return res.status(400).send({ error: 'Usuário já existente'});
        
        const usuario = await user.create(req.body);
    
        user.senha = undefined;

        return res.send({
            usuario
        })
    } catch (err) {
        return res.status(400).send({ error: 'Falha no registro' });
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, senha } = req.body;

    const usuario = await user.buscaUsuario({ email });

    if (!usuario)
        return res.status(400).send({ error: 'Usuário não localizado' });

    if (! await bcrypt.compare(senha, usuario.senha))
        return res.status(400).send({ error: 'Senha Inválida' });
    
    usuario.senha = undefined;

    const data = new Date();

    res.send({
        usuario,
        token: generateToken({ id: usuario.id, codigo: usuario.codigo, time: data.getTime })
    });
});

module.exports = app => app.use('/auth', router);