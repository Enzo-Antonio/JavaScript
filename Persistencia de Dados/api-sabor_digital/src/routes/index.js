const express = require('express')
const router = express.Router()

const produtoRoutes = require('./produtoRoutes')

router.get('/', (req, res) => {
    res.json({
        mensagem: 'API Sabor Digital',
        versao:'5.0.8'
    })
})

router.use('/produtos', produtoRoutes)
router.use('/pedidos', pedidoRoutes)
router.use('/cardapios', cardapioRoutes)

module.exports = router