const mdlTransacoes = require("../model/mdlTransacoes"); // Módulo Model de Transações

const GetAllTransacoes = (req, res) =>
  (async () => {
    let registro = await mdlTransacoes.GetAllTransacoes();
    
    // O seu código original tinha um loop para formatar datas.
    // Vamos adaptá-lo para a data da sua tabela de Transações: 'data_transacao'
    for (let i = 0; i < registro.length; i++) {
      const row = registro[i];
      
      // Verifica se o campo 'data_transacao' existe e é um objeto Date antes de formatar
      if (row.data_transacao && row.data_transacao instanceof Date) {
          const formattedDate = row.data_transacao.toISOString().split('T')[0];
          row.data_transacao = formattedDate;
      }
    }
    
    res.json({ status: "ok", "registro": registro });
  })();

const GetTransacaoByID = (req, res) =>
  (async () => {
    // Usando 'idtransacoes' como ID, conforme sua modelagem SQL
    const transacaoID = parseInt(req.body.idtransacoes);
    let registro = await mdlTransacoes.GetTransacaoByID(transacaoID);


    res.json({ status: "ok", "registro": registro });
  })();

const InsertTransacoes = (request, res) =>
  (async () => {
    //@ Atenção: aqui já começamos a utilizar a variável msg para retornar erros de banco de dados.
    const transacaoREG = request.body; // Variável de registro ajustada
    let { msg, linhasAfetadas } = await mdlTransacoes.InsertTransacoes(transacaoREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const UpdateTransacoes = (request, res) =>
  (async () => {
    const transacaoREG = request.body; // Variável de registro ajustada
    let { msg, linhasAfetadas } = await mdlTransacoes.UpdateTransacoes(transacaoREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const DeleteTransacoes = (request, res) =>
  (async () => {
    const transacaoREG = request.body; // Variável de registro ajustada
    let { msg, linhasAfetadas } = await mdlTransacoes.DeleteTransacoes(transacaoREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

module.exports = {
  GetAllTransacoes,
  GetTransacaoByID,
  InsertTransacoes,
  UpdateTransacoes,
  DeleteTransacoes
};