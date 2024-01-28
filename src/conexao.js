const { Pool } = require("pg");

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "kir@1208",
    database: "dindin",
});

module.exports = pool;
