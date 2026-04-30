const pool = require('../config/database')
const produtoRepository = require('../repositories/produtoRepository')

const ProdutoRepository = require('../repositories/produtoRepository')

class ProdutoService {
    async listarProdutos() {
        const produtos = await ProdutoRepository.listarProdutos()

        return{
            sucesso: true,
            dados: produtos,
            total: produtos.length
        }
    }

    async buscarProdutoPorID(id) {
        if (!id || isNaN(id)) {
            throw{ status: 400, 
                   mensagem: 'ID inválido.'
                }
        }

        const produto = await produtoRepository.buscarProdutoPorID(id)
        
        if(!produto) {
            throw{
                status: 404,
                mensagem: 'Produto não encontrado.'
            }
        }

        return {
            sucesso: true,
            dados: produto[0]
        }
    }
}