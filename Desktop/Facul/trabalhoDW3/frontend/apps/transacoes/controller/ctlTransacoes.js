const axios = require("axios");
const moment = require("moment"); // Mantido para formatação de data

// FUNÇÃO: Abre a tela de Manutenção/Listagem de Transações
const manutTransacoes = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    // Chamada à API para obter todas as Transações
    const apiUrl = process.env.SERVIDOR_DW3Back + "/GetAllTransacoes";

    try {
      const resp = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // Set JWT token in the header
        }
      });

      // Renderiza a view de Manutenção de Transações
      res.render("transacoes/view/vwManutTransacoes.njk", {
        title: "Manutenção de Transações",
        data: resp.data.registro,
        erro: null,
        userName: userName,
      });

    } catch (error) {
      let remoteMSG = "Erro desconhecido";
      if (error.code === "ECONNREFUSED") {
        remoteMSG = "Servidor indisponível";
      } else if (error.response && error.response.status === 401) {
        remoteMSG = "Usuário não autenticado";
      } else if (error.message) {
        remoteMSG = error.message;
      }

      // Renderiza a view com a mensagem de erro
      res.render("transacoes/view/vwManutTransacoes.njk", {
        title: "Manutenção de Transações",
        data: null,
        erro: remoteMSG, // Mensagem de erro mostrada na view
        userName: userName,
      });
    }
  })();

// FUNÇÃO: Inserção de Transações (GET para abrir formulário, POST para salvar)
const insertTransacoes = async (req, res) =>
  (async () => {
    if (req.method == "GET") {
      const token = req.session.token;

      // @ Busca as CONTAS DISPONÍVEIS (relação 1:N)
      const contas = await axios.get(
        process.env.SERVIDOR_DW3Back + "/GetAllContas", { // API para buscar Contas (antigo Cursos)
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      // Renderiza o formulário de Cadastro de Transações
      return res.render("transacoes/view/vwFCrTransacoes.njk", {
        title: "Cadastro de Transações",
        data: null,
        erro: null,
        conta: contas.data.registro, // Passa as Contas para o formulário (dropdown)
        userName: null,
      });

    } else {
      //@ POST - Envio de dados para o Back-End
      const regData = req.body;
      const token = req.session.token;

      try {
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/InsertTransacoes", regData, { // Rota Back-End ajustada
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 5000,
        });

        res.json({
          status: response.data.status,
          msg: response.data.status,
          data: response.data,
          erro: null,
        });
      } catch (error) {
        console.error('[ctlTransacoes|InsertTransacoes] Erro ao inserir dados no servidor backend:', error.message);
        res.json({
          status: "Error",
          msg: error.message,
          data: null, // Mudança: não temos response.data aqui
          erro: null,
        });
      }
    }
  })();

// FUNÇÃO: Visualizar Transação (View)
const ViewTransacao = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    try {
      if (req.method == "GET") {
        const id = req.params.id;
        const oper = req.params.oper; // Variável 'oper' mantida se usada na view
        parseInt(id);

        // Busca a Transação por ID
        let response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetTransacaoByID", // Rota Back-End ajustada
          {
            idtransacoes: id, // ID da transação
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.data.status == "ok") {
          // @ Busca as CONTAS disponíveis (para o dropdown da view)
          const contas = await axios.get(
            process.env.SERVIDOR_DW3Back + "/GetAllContas", { // Rota Back-End ajustada
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          });

          // Formatação da Data
          response.data.registro[0].data_transacao = moment(response.data.registro[0].data_transacao).format("YYYY-MM-DD");

          // Renderiza a view de Leitura/Atualização/Deleção (FRUD)
          res.render("transacoes/view/vwFRUDrTransacoes.njk", { // View ajustada
            title: "Visualização de Transação",
            data: response.data.registro[0],
            disabled: true, // Para modo 'Visualizar'
            conta: contas.data.registro, // Passa as Contas
            userName: userName,
          });
        } else {
          console.log("[ctlTransacoes|ViewTransacao] ID de transação não localizado!");
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlTransacoes.js|ViewTransacao] Transação não localizada!" });
      console.log("[ctlTransacoes.js|ViewTransacao] Try Catch: Erro não identificado", erro);
    }
  })();

// FUNÇÃO: Atualizar Transação (Update)
const UpdateTransacao = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);

        // Busca a Transação por ID (mesmo que na ViewTransacao)
        let response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetTransacaoByID", // Rota Back-End ajustada
          {
            idtransacoes: id, // ID da transação
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.data.status == "ok") {
          // @ Busca as CONTAS disponíveis
          const contas = await axios.get(
            process.env.SERVIDOR_DW3Back + "/GetAllContas", { // Rota Back-End ajustada
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          });

          // Formatação da Data
          response.data.registro[0].data_transacao = moment(response.data.registro[0].data_transacao).format("YYYY-MM-DD");

          // Renderiza a view de Leitura/Atualização/Deleção (FRUD)
          res.render("transacoes/view/vwFRUDrTransacoes.njk", { // View ajustada
            title: "Atualização de Transação",
            data: response.data.registro[0],
            disabled: false, // Habilita a edição
            conta: contas.data.registro, // Passa as Contas
            userName: userName,
          });
        } else {
          console.log("[ctlTransacoes|UpdateTransacao] Dados não localizados");
        }
      } else {
        //@ POST - Envio da atualização para o Back-End
        const regData = req.body;
        const token = req.session.token;

        try {
          // @ Enviando dados para o servidor Backend
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/UpdateTransacoes", regData, { // Rota Back-End ajustada
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            timeout: 5000,
          });

          res.json({
            status: response.data.status,
            msg: response.data.status,
            data: response.data,
            erro: null,
          });
        } catch (error) {
          console.error('[ctlTransacoes.js|UpdateTransacao] Erro ao atualizar dados de transações no servidor backend:', error.message);
          res.json({
            status: "Error",
            msg: error.message,
            data: null,
            erro: null,
          });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlTransacoes.js|UpdateTransacao] Transação não localizada!" });
      console.log("[ctlTransacoes.js|UpdateTransacao] Try Catch: Erro não identificado", erro);
    }
  })();

// FUNÇÃO: Deletar Transação (Soft Delete)
const DeleteTransacao = async (req, res) =>
  (async () => {
    //@ POST
    const regData = req.body;
    const token = req.session.token;

    try {
      // @ Enviando dados para o servidor Backend
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/DeleteTransacoes", regData, { // Rota Back-End ajustada
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 5000,
      });

      res.json({
        status: response.data.status,
        msg: response.data.status,
        data: response.data,
        erro: null,
      });
    } catch (error) {
      console.error('[ctlTransacoes.js|DeleteTransacao] Erro ao deletar dados de transações no servidor backend:', error.message);
      res.json({
        status: "Error",
        msg: error.message,
        data: null,
        erro: null,
      });
    }
  })();

module.exports = {
  manutTransacoes,
  insertTransacoes,
  ViewTransacao,
  UpdateTransacao,
  DeleteTransacao
};