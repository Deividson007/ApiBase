const db = require('../database/index');
const bcrypt = require('bcryptjs');

module.exports = {
    async create(req, res) {
        const { nome, email, senha } = req;
        const ativo = true;
        const hash = await bcrypt.hash(senha, 10);
        const query = {
            text: 'insert into public.usuario(nome, email, senha, ativo) values ($1, $2, $3, $4) RETURNING *',
            values: [nome, email, hash, ativo]
        };

        const { rows } = await db.query(query);

        return rows[0];
    },

    async verificaExisteEmail(req, res) {
        const { email } = req;
        const query = {
            text: 'select count(idusuario)::int::boolean as resp from usuario where email = $1',
            values: [email]
        };

        const { rows } = await db.query(query);
        return rows[0].resp;
    },

    async buscaUsuario(req, res) {
        const { email } = req;
        const query = {
            text: 'select idusuario, codigo, nome, email, senha from usuario where email = $1',
            values: [email]
        };

        const { rows } = await db.query(query);
        return rows[0];
    }
};