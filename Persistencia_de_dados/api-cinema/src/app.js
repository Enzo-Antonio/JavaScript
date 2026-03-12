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
            mensagem: 'Erro ao listar os filmes',
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
            mensagem: 'Erro ao encontrar filme',
            erro: erro.message
        });
    }
});

// Exemplo de POST (vazio por enquanto)
app.post('/filmes', async (req, res) => {
    try {
        const {titulo, genero, duracao, classificacao, ano_lancamento} = req.body
    } catch (erro) {
        res.status(500).send("Erro");
    }
});

module.exports = app;