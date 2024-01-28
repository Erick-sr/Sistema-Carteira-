const bcrypt = require("bcrypt");
const pool = require("../conexao");
const jwt = require("jsonwebtoken");
const senhaJwt = require("../senhaJwt");

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const emailExiste = await pool.query(
            "select*from usuarios where email = $1",
            [email]
        );
        if (emailExiste.rowCount > 0) {
            return res.status(400).json({ mensage: "email já existe " });
        }

        const senhacriptografada = await bcrypt.hash(senha, 10);

        const query =
            "insert into usuarios (nome, email, senha) values ($1, $2, $3) returning*"; // apenas para ficar mais organizado

        const { rows } = await pool.query(query, [
            nome,
            email,
            senhacriptografada,
        ]);

        const { senha: _, ...usuario } = rows[0]; // utilizou desestruturação para  não mostrar a senha

        return res.status(201).json(usuario);
    } catch (error) {
        return res.status(500).json({ mensage: "Erro interno do servidor " });
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const { rows, rowCount } = await pool.query(
            "select*from usuarios where email = $1",
            [email]
        );
        if (rowCount === 0) {
            return res
                .status(400)
                .json({ mensage: "email ou senha incorreto " });
        }

        const { senha: senhaUsuario, ...usuario } = rows[0];

        const senhaCorreta = await bcrypt.compare(senha, senhaUsuario);
        if (!senhaCorreta) {
            return res
                .status(400)
                .json({ mensage: "Email ou senha incorreto" });
        }
        const token = jwt.sign({ id: usuario.id }, senhaJwt, {
            expiresIn: "8h",
        });

        return res.json({
            usuario,
            token,
        });
    } catch (error) {
        return res.status(500).json({ mensage: "Erro interno do servidor " });
    }
};

module.exports = { cadastrarUsuario, login };
