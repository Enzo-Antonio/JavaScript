const express = require('express');
const pool = require('./config/database');

const app = express();
app.use(express.json());

const queryAsync =(sql, values = []) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        })
    })
}

app.get('/', (req, res) => {
    res.send('API SABORDIGITAL_B');
});

// Listas todos os produtos
app.get('/produto', async (req, res) => {
    try {
        const produtos = await queryAsync('SELECT * FROM produto ORDER BY id DESC')
        res.json({
            sucesso: true,
            dados: produtos,
            total: produtos.length
        });
    } catch (erro) {
        console.error('Erro ao listar produtos: ', erro);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar produtos.',
            erro: erro.message
        });
    }
});

// Listar produtos por ID
app.get('/produto/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de produto inválido.'
            });
        }
        
        const produtos = await queryAsync('SELECT * FROM produto WHERE id = ?', [id])

        if (produtos.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado.'
            });
        }

        res.json({
            sucesso: true,
            dados: produtos[0]
        });

    } catch (erro) {
        console.error('Erro ao procurar produto: ', erro);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao encontrar produto.',
            erro: erro.message
        });
    }
});

// Criar produto
app.post('/produto', async (req, res) => {
    try {
        const {nome, descricao, preco, disponivel} = req.body
        if (!nome || !descricao || !preco) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nome, descrição, preço e disponibilidade são obrigatórios.'
            });
        }
        if (typeof preco !== 'number' || preco <= 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Preco deve ser um número positivo.'
            });
        }
        
        const novoProduto = {
            nome: nome.trim(),
            descricao: descricao.trim(),
            preco,
            disponivel
        }

        const resultado = await queryAsync('INSERT INTO produto SET ?', [novoProduto])
        
        res.status(201).json({
            sucesso: true,
            mensagem: 'Produto cadastrado com sucesso!',
            id: resultado.insertId
        });

    } catch (erro) {
        console.error('Erro ao salvar produto.', erro)

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao salvar produto.',
            erro: erro.message
        });
    }
});

// Alterar informações dos produtos
app.put('/produto/:id', async (req, res) => {
    try {
        const {id} = req.params
        const {nome, descricao, preco, disponivel} = req.body

        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID do produto inválido.'
            });
        }

        const produtoExiste = await queryAsync('SELECT * FROM produto WHERE id = ?', [id])
        if (produtoExiste.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado.'
            });
        }

        const produtoAtualizado = {}
        if (nome !== undefined) produtoAtualizado.nome = nome.trim()
        if (descricao !== undefined) produtoAtualizado.descricao = descricao.trim()
        if (preco !== undefined) {
            if (typeof preco !== 'number' || preco <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Preço deve ser um número positivo.'
                })
            }
            produtoAtualizado.preco = preco
        }
        if (disponivel !== undefined) produtoAtualizado.disponivel = disponivel
        if (Object.keys(produtoAtualizado).length == 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nenhum campo alterado.'
            });
        }

        await queryAsync('UPDATE produto SET ? WHERE id = ?', [produtoAtualizado, id])
        res.json({
            sucesso: true,
            mensagem: 'Informações alteradas com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao alterar informações do filme.', erro)

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao alterar informações do filme.',
            erro: erro.message
        });
    }
});

// Excluir um produto
app.delete('/produto/:id', async (req, res) => {
    try {
        const {id} = req.params
        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID produto inválido.'
            });
        }

        const produtoExiste = await queryAsync('SELECT * FROM produto WHERE id = ?', [id])

        if (produtoExiste.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado.'
            });
        }
        await queryAsync('DELETE FROM produto WHERE id = ?', [id])
        res.json({
            sucesso: true,
            mensagem: 'Produto excluído com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao excluir produto.', erro)

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao excluir produto.',
            erro: erro.message
        });
    }
});

module.exports = app