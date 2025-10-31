const db = require("../../../database/databaseconfig");

const GetAllContas = async () => {
    return (
        await db.query(
            "SELECT * " +
            "FROM contas where deleted = false ORDER BY nome_banco ASC"
        )
    ).rows;
};

const GetContaByID = async (contaIDPar) => {
    return (
        await db.query(
            "SELECT * " +
            "FROM contas WHERE idconta = $1 and deleted = false ORDER BY nome_banco ASC", 
            [contaIDPar]
        )
    ).rows;
};


const InsertContas = async (registroPar) => {
    //@ Atenção: aqui já começamos a utilizar a variável msg para retornor erros de banco de dados.
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "INSERT INTO contas " +
                "values($1, $2, $3, $4)", 
                [
                    registroPar.nome_banco,
                    registroPar.numero_agencia,
                    registroPar.numero_conta,
                    registroPar.deleted, 
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlContas|InsertContas] " + error.detail; 
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};


const UpdateContas = async (registroPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE contas SET " + 
                "nome_banco = $2, " +
                "numero_agencia = $3, " +
                "numero_conta = $4 " +
                "WHERE idconta = $1", 
                [
                    registroPar.idconta, 
                    registroPar.nome_banco,
                    registroPar.numero_agencia,
                    registroPar.numero_conta,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlContas|UpdateContas] " + error.detail; 
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

// Função: Soft Delete (Atualiza 'deleted' para true)
const DeleteContas = async (registroPar) => {
    let linhasAfetadas;
    let msg = "ok";

    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE contas SET " + "deleted = true " + "WHERE idconta = $1", 
                [registroPar.idconta]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlContas|DeleteContas] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

module.exports = {
    GetAllContas,
    GetContaByID,
    InsertContas,
    UpdateContas,
    DeleteContas,
};