const { Client, Pool } = require("pg");
const dbAuth = require("./auth");

const pool = new Pool(dbAuth);
const client = new Client(dbAuth);

module.exports = {
    query: (text, params) => pool.query(text, params)
};