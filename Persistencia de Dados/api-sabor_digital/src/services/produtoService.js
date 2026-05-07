const pool = require('../config/database')
const produtoRepository = require('../repositories/produtoRepository')

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
    
    async cadastrarProduto(dados) {
        const {nome, descricao, preco, categoria, disponivel}

        if (!nome || !descricao || preco === undefined) {
            throw {
                status: 400,
                mensagem: 'Nome, descrição e preço são obrigatórios.'
            }
        }

        if(typeof preco != 'number' || preco <= 0) {
            throw {
                status: 400,
                mensagem: 'O preço deve ser um NÚMERO positivo.'
            }
        }
        
        const novoProduto = {
            nome: nome.trim(),
            descricao: descricao.trim(),
            preco,
            categoria: categoria || null,
            disponivel: disponivel || true
        }

        const resultado = await produtoRepository.cadastrarProduto(novoProduto)

        return {
            sucesso: true,
            mensagem: 'Produto cadastrado com sucesso! ✅',
            resultado
        }
    }

    async atualizarProduto(id, dados) {
        if(!id || isNaN(id)) {
            throw {
                status: 400,
                mensagem: 'ID inválido.'
            }
        }

        const produtoID = await produtoRepository.buscarProdutoPorID(id)

        if(produtoID.length === 0) {
           throw {
            status: 404,
            mensagem: 'Produto não encontrado.'
           }
        }

        const produtoAtualizado = {}

        const {nome, descricao, preco, categoria, disponivel} = dados

        if(nome !== undefined || nome.trim() !== '') produtoAtualizado.nome = nome.trim()
        if (descricao !== undefined) produtoAtualizado.descricao = descricao.trim()
        if (preco !== undefined) {
            if (typeof preco !== 'number' || preco < 0) {
                throw {
                    status: 400,
                    mensagem: 'Preço deve ser um número positivo.'
                }
            }
            produtoAtualizado.preco = preco
        }
        if(categoria !== undefined) produtoAtualizado.categoria = categoria
        if(disponivel !== undefined) produtoAtualizado.disponivel = disponivel

        if(Object.keys(produtoAtualizado).length === 0) {
            throw {
                status: 400,
                mensagem: 'Nenhum dado enviado para atualização.'
            }
        }

        await produtoRepository.atualizarProduto(id, produtoAtualizado)

        return {
            sucesso: true,
            mensagem: 'Produto atualizado com sucesso! ✅'
        }
    }

    async excluirProduto(id) {
        if(!id || isNaN(id)) {
            throw {
                status: 400,
                mensagem: 'ID inválido.'
            }
        }

        const idProduto = await produtoRepository.buscarProdutoPorID(id)

        if(!idProduto) {
            throw {
                status: 404,
                mensagem: 'Produto não encontrado.'
            }
        }

        await produtoRepository.excluirProduto(id)

        return {
            sucesso: true,
            mensagem: 'Produto deletado com sucesso! ✅'
        }
    }
}

module.exports = new ProdutoService()