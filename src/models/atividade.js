const db = require("../database/index");

module.exports = {
    async load(req, res) {
        const { codigo, time } = req.body;

        const query = {
            text: "select a.idatividade, a.descricao, a.idrelevancia from atividade a inner join usuario u on a.idusuario = u.idusuario inner join time t on a.idtime = t.idtime where u.codigo = $1 and t.codigo = $2 and a.ativo = true",
            values: [codigo, time]
        };

        const { rows } = await db.query(query);

        return rows;
    }
}