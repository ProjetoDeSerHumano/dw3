const mdlContas = require("../model/mdlContas"); 

const GetAllContas = (req, res) =>
  (async () => {
    let registro = await mdlContas.GetAllContas();
    res.json({ status: "ok", registro: registro });
  })();

const GetContaByID = (req, res) =>
  (async () => {
    const contaID = parseInt(req.body.idconta); 
    let registro = await mdlContas.GetContaByID(contaID);

    res.json({ status: "ok", registro: registro });
  })();

const InsertContas = (request, res) =>
  (async () => {
    const registro = request.body;
    let { msg, linhasAfetadas } = await mdlContas.InsertContas(registro);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

const UpdateContas = (request, res) =>
  (async () => {
    const registro = request.body;
    let { msg, linhasAfetadas } = await mdlContas.UpdateContas(registro);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

const DeleteContas = (request, res) =>
  (async () => {
    const registro = request.body;
    let { msg, linhasAfetadas } = await mdlContas.DeleteContas(registro);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

module.exports = {
  GetAllContas,
  GetContaByID,
  InsertContas,
  UpdateContas,
  DeleteContas
};