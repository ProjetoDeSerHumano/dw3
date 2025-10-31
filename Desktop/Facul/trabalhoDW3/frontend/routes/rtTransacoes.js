var express = require('express');
var router = express.Router();
// O controlador foi renomeado de 'alunos' para 'transacoes'
var transacoesApp = require("../apps/transacoes/controller/ctlTransacoes") 


// Função necessária para evitar que usuários não autenticados acessem o sistema.
// OBS: Esta é a verificação de sessão do LADO DO FRONT-END.
function authenticationMiddleware(req, res, next) {
    // Verificar se existe uma sessão válida.
    // Você precisa garantir que a variável 'isLogged' seja definida após o login, 
    // ou que haja uma verificação para 'req.session.token'
    isLogged = req.session.isLogged;    
    
    if (!isLogged) {      
      res.redirect("/Login");
    }
    next();
};  
    
/* GET métodos */
// Rota para a tela de listagem/manutenção
router.get('/manutTransacoes', authenticationMiddleware, transacoesApp.manutTransacoes);
// Rota para abrir o formulário de inserção
router.get('/insertTransacoes', authenticationMiddleware, transacoesApp.insertTransacoes);
// Rota para abrir a visualização (modo leitura)
router.get('/ViewTransacao/:id', authenticationMiddleware, transacoesApp.ViewTransacao);
// Rota para abrir o formulário de atualização (modo edição)
router.get('/UpdateTransacao/:id', authenticationMiddleware, transacoesApp.UpdateTransacao);

/* POST métodos */
// Rota para submeter o formulário de inserção
router.post('/InsertTransacoes', authenticationMiddleware, transacoesApp.insertTransacoes);
// Rota para submeter o formulário de atualização
router.post('/UpdateTransacao', authenticationMiddleware, transacoesApp.UpdateTransacao);
// Rota para submeter a deleção (soft delete)
router.post('/DeleteTransacao', authenticationMiddleware, transacoesApp.DeleteTransacao);
// router.post('/viewTransacao', authenticationMiddleware, transacoesApp.viewTransacao);


module.exports = router;