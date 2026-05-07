const express = require('express')
const router = express.Router()
const ProdutoController = require('../controllers/produtoController')

router.get('/', ProdutoController.listarProdutos)
router.get('/:id', ProdutoController.buscarProdutoPorID)
router.post('/', ProdutoController.cadastrarProduto)
router.put('/:id', ProdutoController.atualizarProduto)
router.delete('/:id', ProdutoController.excluirProduto)

module.exports = router