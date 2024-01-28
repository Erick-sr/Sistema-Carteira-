const express = require("express");
const {
    listarcategorias,
    listartransacao,
    detalhartransacao,
    cadastrartransacao,
    atualizartransacao,
    excluirtransacao,
    extratotransacao,
} = require("./controladores/transacao");

const { cadastrarUsuario, login } = require("./controladores/usuarios");
const verificacaoLogin = require("./intermediarios/autentica");

const rotas = express();
rotas.post("/usuario", cadastrarUsuario);
rotas.post("/login", login);

rotas.get("/categoria", listarcategorias);
rotas.get("/transacao", verificacaoLogin, listartransacao);
rotas.get("/transacao/extrato", verificacaoLogin, extratotransacao);
rotas.get("/transacao/:id", verificacaoLogin, detalhartransacao);
rotas.post("/transacao", verificacaoLogin, cadastrartransacao);
rotas.post("/transacao/:id", verificacaoLogin, atualizartransacao);
rotas.delete("/transacao/:id", verificacaoLogin, excluirtransacao);

module.exports = rotas;
