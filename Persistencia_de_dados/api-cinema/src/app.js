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

// Criar filme
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

// Alterar informações dos filmes
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

// Excluir um filme
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

// CRUD DAS SALAS
// Listar todas as salas
app.get('/salas', async (req, res) => {
    try {
        const salas = await queryAsync('SELECT * FROM sala');
        res.json({
            sucesso: true,
            dados: salas,
            total: salas.length
        });
    } catch (erro) {
        console.error('Erro ao listar as salas: ', erro);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar as salas.',
            erro: erro.message
        });
    }
});

// Listar as salas por ID
app.get('/salas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID da sala inválido.'
            });
        }

        const sala = await queryAsync('SELECT * FROM sala WHERE id = ?', [id]);
        
        if (sala.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sala não encontrada.'
            });
        }

        res.json({
            sucesso: true,
            dados: sala[0]
        });
    
    } catch (erro) {
        console.error('Erro ao encontrar a sala: ', erro);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao encontrar a sala.',
            erro: erro.message
        });
    }
});

// Criar sala 
app.post('/salas', async (req, res) => {
    try {
        const { nome, capacidade } = req.body;

        if (!nome || !capacidade) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O nome da sala e a capacidade são obrigatórios.'
            });
        }
        const novaSala = {
            nome: nome.trim(),
            capacidade: capacidade
        };
        const resultado = await queryAsync('INSERT INTO sala SET ?', [novaSala]);

        res.status(201).json({
            sucesso: true,
            mensagem: 'Sala registrada com sucesso!',
            id: resultado.insertId
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

// Alterar informações
app.put('/salas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, capacidade } = req.body;

        const salaAtualizada = {};
        if (nome !== undefined) salaAtualizada.nome = nome.trim();
        if (capacidade !== undefined) salaAtualizada.capacidade = capacidade;

        if (Object.keys(salaAtualizada).length === 0) {
            return res.status(400).json({ sucesso: false, mensagem: 'Nada para atualizar.' });
        }
        await queryAsync('UPDATE sala SET ? WHERE id = ?', [salaAtualizada, id]);
        
        res.json({ sucesso: true, mensagem: 'Sala atualizada!' });
    } catch (erro) {
        res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

// Excluir uma sala
app.delete('/salas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID sala inválido.'
            });
        }

        const salaExiste = await queryAsync('SELECT * FROM sala WHERE id = ?', [id]);
        if (salaExiste.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sala não encontrada.'
            });
        }

        await queryAsync('DELETE FROM sala WHERE id = ?', [id]);
        res.json({
            sucesso: true,
            mensagem: 'Sala excluída com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao excluir sala.', erro);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao excluir sala.',
            erro: erro.message
        });
    }
});

// CRUD das Sessões
// Listas todas as sessões
app.get('/sessoes', async (req, res) => {
    try {
        const salas = await queryAsync('SELECT * FROM sessao');
        res.json({
            sucesso: true,
            dados: sessoes,
            total: sessoes.length
        });
    } catch (erro) {
        console.error('Erro ao listar as sessoes: ', erro);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar as sessoes.',
            erro: erro.message
        });
    }
});

// Listar as sessoe por ID
app.get('/sessoes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID da sessão inválido.'
            });
        }

        const sala = await queryAsync('SELECT * FROM sessao WHERE id = ?', [id]);
        
        if (sessao.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sessão não encontrada.'
            });
        }

        res.json({
            sucesso: true,
            dados: sessao[0]
        });
    
    } catch (erro) {
        console.error('Erro ao encontrar a sessão: ', erro);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao encontrar a sessão.',
            erro: erro.message
        });
    }
});

// Criar sessão
app.post('/sessoes', async (req, res) => {
    try {
        const { id_filme, id_sala, data_hora, preco } = req.body;

        if (!id_filme || !id_sala || !data_hora || !preco) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O número da sessão, horário e disponibilidade são obrigatórios.'
            });
        }
        const novaSala = {
            nome: nome.trim(),
            capacidade: capacidade
        };
        const resultado = await queryAsync('INSERT INTO sala SET ?', [novaSala]);

        res.status(201).json({
            sucesso: true,
            mensagem: 'Sala registrada com sucesso!',
            id: resultado.insertId
        });
    } catch (erro) {
        res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

module.exports = app;