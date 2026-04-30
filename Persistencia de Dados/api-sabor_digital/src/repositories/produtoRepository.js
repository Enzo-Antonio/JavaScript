const pool = require('../config/database')

class ProdutoRepository {
    async listarProdutos() {
        const listaProdutos = await pool.query("SELECT * FROM produto")
        return listaProdutos
    }

    async buscarProdutoPorID(id) {
        const produtoBuscado = await pool.query("SELECT * FROM produto WHERE id = ?", [id])
        return produtoBuscado[0]
    }

    async cadastrarProduto(dadosDoProduto) {
        const resultadoCadastroDeProduto = await pool.query("INSERT INTO produto SET ?", [dadosDoProduto])
        return resultadoCadastroDeProduto.insertId
    }

    async atualizarProduto(id, dadosDoProdutoproduto) {
        const produtoAtualizado = await pool.query("UPDATE INTO produto SET ? WHERE id = ?", [dadosDoProduto, id])
        return produtoAtualizado
    }

    async excluirProduto(id) {
        await pool.query("DELETE FROM produto WHERE id = ?", [id])
        return true
    }
}

module.exports = new ProdutoRepository()