const express = require('express');
const pool = require('./config/database');

const app = express();
app.use(express.json());

// Função auxiliar para usar Promises com o Pool
const queryAsync = (sql, values = []) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

app.get('/', (req, res) => {
    res.send("API CINEMA");
});

// Listar todos os filmes
app.get('/filmes', async (req, res) => {
    try {
        const filmes = await queryAsync('SELECT * FROM filme');
        res.json({
            sucesso: true,
            dados: filmes,
            total: filmes.length
        });
    } catch (erro) {
        console.error('Erro ao listar os filmes: ', erro);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar os filmes.',
            erro: erro.message
        });
    }
});

// Buscar filme por ID
app.get('/filmes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de filme inválido.'
            });
        }

        const filme = await queryAsync('SELECT * FROM filme WHERE id = ?', [id]);
        
        if (filme.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Filme não encontrado.'
            });
        }

        res.json({
            sucesso: true,
            dados: filme[0]
        });
    
    } catch (erro) {
        console.error('Erro ao encontrar filme: ', erro);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao encontrar filme.',
            erro: erro.message
        });
    }
});

// Exemplo de POST (vazio por enquanto)
app.post('/filmes', async (req, res) => {
    try {
        const {titulo, genero, duracao, classificacao, data_lancamento} = req.body
        if (!titulo || !genero || !duracao) {
            return res.status(400).json({
            sucesso: false,
            mensagem: 'Título, gênero e duração são obrigatórios.'
            })
        }
        if (typeof duracao !== 'number' || duracao <= 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Duração deve ser um número positivo.'
            })
        }

        const novoFilme = {
            titulo: titulo.trim(),
            genero: genero.trim(),
            duracao,
            classificacao: classificacao || null,
            data_lancamento: data_lancamento || null
        }

        const resultado = await queryAsync('INSERT INTO filme SET ?', [novoFilme])

        res.status(201).json({
            sucesso: true,
            mensagem: 'Filme cadastrado com sucesso!',
            id: resultado.insertId
        })

    } catch (erro) {
        console.error('Erro ao salvar filme.', erro)

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao salvar filme.',
            erro: erro.message
        })
    }
});

app.put('/filmes/:id', async (req, res) => {
    try {
        const {id} = req.params
        const {titulo, genero, duracao, classificacao, data_lancamento} = req.body

        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID filme inválido.'
            })
        }

        const filmeExiste = await queryAsync('SELECT * FROM filme WHERE id = ?', [id])

        if (filmeExiste.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Filme não encontrado.'
            })
        }

        const filmeAtualizado = {}

        if (titulo !== undefined) filmeAtualizado.titulo = titulo.trim()
        if (genero !== undefined) filmeAtualizado.genero = genero.trim()
        if (duracao !== undefined) {
            if (typeof duracao !== 'number' || duracao <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Duração deve ser um número positivo.'
                })
            }
            filmeAtualizado.duracao = duracao 
        }
        if (classificacao !== undefined) filmeAtualizado.classificacao = classificacao
        if (data_lancamento !== undefined) filmeAtualizado.data_lancamento = data_lancamento

        if (Object.keys(filmeAtualizado).length == 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nenhum campo alterado.'
            })
        }

        await queryAsync('UPDATE filme SET ? WHERE id= ?', [filmeAtualizado, id])
        res.json({
            sucesso: true,
            mensagem: 'Informações alteradas com sucesso!'
        })

    } catch (erro) {
        console.error('Erro ao alterar informações do filme.', erro)

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao alterar informações do filme.',
            erro: erro.message
        })
    }
})

app.delete('/filmes/:id', async (req, res) => {
    try {
        const {id} = req.params
         if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID filme inválido.'
            })
        }

        const filmeExiste = await queryAsync('SELECT * FROM filme WHERE id = ?', [id])

        if (filmeExiste.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Filme não encontrado.'
            })
        }
        await queryAsync('DELETE FROM filme WHERE id = ?', [id])
        res.json({
            sucesso: true,
            mensagem: 'Filme exluído com sucesso!'
        })

    } catch (erro) {
        console.error('Erro ao excluir filme.', erro)

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao excluir filme.',
            erro: erro.message
        })
    }
});

module.exports = app;