const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authConfig = require("../config/auth");
const user = require("../models/user");

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 7200
    });
}

router.post("/register", async (req, res) => {
    const { email } = req.body;
    try {
        if (await user.verificaExisteEmail({ email }))
            return res.status(400).send({ error: "Usuário já existente"});
        
        const usuario = await user.create(req.body);
    
        user.senha = undefined;

        return res.send({
            usuario
        })
    } catch (err) {
        return res.status(400).send({ error: "Falha no registro" });
    }
});

router.post("/authenticate", async (req, res) => {
    const { email, senha } = req.body;

    const usuario = await user.buscaUsuario({ email });

    if (!usuario)
        return res.status(400).send({ error: "Usuário não localizado" });

    if (! await bcrypt.compare(senha, usuario.senha))
        return res.status(400).send({ error: "Senha Inválida" });
    
    usuario.senha = undefined;

    const data = new Date();

    res.send({
        usuario,
        token: generateToken({ id: usuario.id, nome: usuario.nome, codigo: usuario.codigo, email: usuario.email, time: usuario.time })
    });
});

router.get("/load-session", async (req, res) => {
    let token = ""; 
    
    if (req.headers.autorization !== undefined) 
        token = req.headers.autorization.split(" ")[1];
    else
        token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err) {
            return res.status(401).send({ error: "Sessão inválida ou expirada"});
        }

        res.send({
            token,
            usuario: decoded
        });
    });
});

module.exports = app => app.use("/auth", router);