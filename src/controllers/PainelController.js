const express = require("express");
const authMiddleware = require("../middlewares/auth");
const paths = require("../config/paths");
const atividade = require("../models/atividade");

const router = express.Router();
router.use(authMiddleware);

router.post("/load", async (req, res) => {
    try {
        const atividades = await atividade.load(req);
        res.send(atividades);
    } catch (err) {
        return res.status(400).send({ error: "Falha na solicitação" });
    }
});

module.exports = app => app.use("/painel", router);