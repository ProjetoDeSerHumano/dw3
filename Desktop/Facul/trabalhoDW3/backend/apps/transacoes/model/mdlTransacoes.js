const db = require("../../../database/databaseconfig");

// Função: Retorna todas as transações, incluindo o nome do Banco (da Conta)
const GetAllTransacoes = async () => {
  return (
    await db.query(
      // Seleciona todos os campos da transação e o nome do banco da conta relacionada
      "SELECT *, (SELECT nome_banco from contas WHERE idconta = transacoes.id_conta) as nome_banco " + 
        "FROM transacoes where deleted = false ORDER BY data_transacao DESC" // Ajustado para 'transacoes' e ordenação por data
    )
  ).rows;
};

// Função: Retorna uma transação por ID, incluindo o nome do Banco
const GetTransacaoByID = async (transacaoIDPar) => {
  return (
    await db.query(
      "SELECT *, (SELECT nome_banco from contas WHERE idconta = transacoes.id_conta) as nome_banco " +
        "FROM transacoes WHERE idtransacoes = $1 and deleted = false ORDER BY data_transacao DESC", // Ajustado para 'transacoes' e 'idtransacoes'
      [transacaoIDPar]
    )
  ).rows;
};

// Função: Insere um novo registro de transação
const InsertTransacoes = async (transacaoREGPar) => {
  //@ Atenção: aqui já começamos a utilizar a variável msg para retornar erros de banco de dados.
  let linhasAfetadas;
  let msg = "ok";
  try {
    // A query de INSERT precisa listar explicitamente os campos da tabela 'transacoes'
    // Campos: idtransacoes (auto), descricao, valor, data_transacao, tipo_operacao, id_conta, deleted
    linhasAfetadas = (
      await db.query(
        "INSERT INTO transacoes (descricao, valor, data_transacao, tipo_operacao, id_conta, deleted) " + 
        "VALUES ($1, $2, $3, $4, $5, $6)",
        [
          transacaoREGPar.descricao,
          transacaoREGPar.valor,
          transacaoREGPar.data_transacao,
          transacaoREGPar.tipo_operacao,
          transacaoREGPar.id_conta, // Chave estrangeira para a tabela 'contas'
          false, // 'deleted' deve ser false na inserção
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlTransacoes|InsertTransacoes] " + error.detail; // Nome do módulo ajustado
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

// Função: Atualiza um registro de transação
const UpdateTransacoes = async (transacaoREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE transacoes SET " + // Ajustado para 'transacoes'
          "descricao = $2, " +
          "valor = $3, " +
          "data_transacao = $4, " +
          "tipo_operacao = $5, " +
          "id_conta = $6, " + // Campo de relacionamento
          "deleted = $7 " + 
          "WHERE idtransacoes = $1", // Chave de busca ajustada para 'idtransacoes'
        [
          transacaoREGPar.idtransacoes, // $1
          transacaoREGPar.descricao,    // $2
          transacaoREGPar.valor,        // $3
          transacaoREGPar.data_transacao, // $4
          transacaoREGPar.tipo_operacao, // $5
          transacaoREGPar.id_conta,     // $6
          transacaoREGPar.deleted,      // $7
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlTransacoes|UpdateTransacoes] " + error.detail; // Nome do módulo ajustado
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

// Função: Soft Delete (Atualiza 'deleted' para true)
const DeleteTransacoes = async (transacaoREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
    
  try {
    linhasAfetadas = (
    await db.query(
      "UPDATE transacoes SET " + "deleted = true " + "WHERE idtransacoes = $1", // Ajustado para 'transacoes' e 'idtransacoes'
      [transacaoREGPar.idtransacoes]
    )
  ).rowCount;
} catch (error) {
  msg = "[mdlTransacoes|DeleteTransacoes] " + error.detail; // Nome do módulo ajustado
  linhasAfetadas = -1;
}

return { msg, linhasAfetadas };
};

module.exports = {
  GetAllTransacoes,
  GetTransacaoByID,
  InsertTransacoes,
  UpdateTransacoes,
  DeleteTransacoes,
};