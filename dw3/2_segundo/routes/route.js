//@ Importa as bibliotecas e arquivos
const express = require("express");
const routerApp = express.Router();
const appHello = require("../controller/ctlHello");

//@ Configura as rotas
routerApp.get("/", appHello.hello);
routerApp.post("/helloUser", appHello.helloUser);

//@ Exporta a variável com as rotas
module.exports = routerApp;