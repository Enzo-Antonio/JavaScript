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

    async atualizarProduto(id, dadosDoProduto) {
        const camposProduto = []
        const dadoProduto = []

        for(const [key, value] of Object.entries(dadosDoProduto)) {
            camposProduto.push(`${key} = ?`)
            dadoProduto.push(value)
        }

        if(camposProduto.length === 0) return null

        dadoProduto.push(id)

        const query = 'UPDATE produto SET ${camposProduto.join(",")} WHERE id = ?'

        const resultado = await pool.query(query, dadoProduto)

        return resultado.affectedRows
    }

    async excluirProduto(id) {
        await pool.query("DELETE FROM produto WHERE id = ?", [id])
        return true
    }
}

module.exports = new ProdutoRepository()