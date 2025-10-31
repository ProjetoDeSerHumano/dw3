const { Cookie } = require("express-session");
// Se você for usar validação, descomente o require e use a função no POST
//const validate = require("../validate/vldLogin") 
const axios = require("axios");

const LoginUsuario = async (req, res) =>
  (async () => {
    let remoteMSG; // Variável para capturar mensagens de erro do servidor

    if (req.method == "POST") {
      //@ Lógica POST: Tentar Fazer o Login
      const formData = req.body;

      /*
      // Se for usar a validação local (Front-End), descomente:
      if (!validate.Validar(formData)) {
        return res.status(400).json({ status: "error", msg: "Dados de entrada validados" });
      };
      */

      const resp = await axios.post(process.env.SERVIDOR_DW3Back + "/login", formData, { // Rota e Variavel de Ambiente ajustadas
        headers: {
          "Content-Type": "application/json",
        },
      }).catch(error => {
        // Tratar erro de conexão ou retorno do Back-End
        if (error.code === "ECONNREFUSED") {
          remoteMSG = "Servidor da API indisponível.";
        } else if (error.response && error.response.data && error.response.data.msg) {
          remoteMSG = error.response.data.msg;
        } else {
          remoteMSG = "Erro desconhecido durante o login.";
        }
        return res.status(400).json({ status: "error", msg: remoteMSG });
      });

      if (!resp || !resp.data) {
        return; // Sai em caso de erro capturado no catch
      }

      // Se o login foi bem-sucedido (status: ok)
      if (resp.data.status === "ok") {
        // REQUISITO ATENDIDO: Controle de Sessão
        req.session.token = resp.data.token; // Armazena o JWT na sessão
        req.session.userName = resp.data.userName; // Armazena o username na sessão
        
        return res.json({ status: "ok", msg: "Login com sucesso!", token: resp.data.token });
      } else {
         // Se o Back-End retornar um status 'error'
        return res.status(400).json({ status: "error", msg: resp.data.msg || "Credenciais inválidas." });
      }

    } else {
      //@ Lógica GET: Abrir a tela de Login
      var parametros = { title: "Módulo Financeiro - Login" }
      res.render("login/view/vwLogin.njk", { parametros }); // View ajustada para o padrão de login
    }
  })();


module.exports = {
  LoginUsuario, 
};