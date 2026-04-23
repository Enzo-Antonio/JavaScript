const express = require('express');
const pool = require('./config/database');

const app =  express();
app.use(express.json());

const queryAsync = (sql, values = []) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

function validarID() {
    if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID inválido.'
            });
        };
};

function validarErro500() {
    console.error(erro);
        res.status(500).json({
            sucesso: false,
            mensagem: erro,
            erro: erro.message
        });
}

//Exercício 1 - Usuários

function mensagem(res, tipo){
    res.status(404).json({
        sucesso: false,
        mensagem: `${tipo} não encontrado(a).`
    });
};

function validarExistencia(resultado, res, tipo){
    if (resultado.length === 0) {
        mensagem(res, tipo)
        return false
        }
    return true
    };

app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await queryAsync("SELECT * FROM usuario")
        res.json({
            sucesso: true,
            dados: usuarios,
            total: usuarios.length
        });
    }
    catch (erro) {
        console.error('Erro ao listar usuários: ', erro);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar usuários.',
            erro: erro.message
        });
    }
});

app.get('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const usuarios = await queryAsync("SELECT * FROM usuario WHERE id = ?", [id])

        if(!validarExistencia(usuarios, res, 'Usuário')){
            return
        }

        if (usuarios.length == 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Usuário não encontrado.'
            });
        }
        res.json({
            sucesso: true,
            dados: usuarios[0]
        });

    } catch (erro) {
        console.error('Erro ao procurar usuário: ', erro);
        res.status(500).json({
            sucesso: false, mensagem: 'Erro ao encontrar usuário.',
            erro: erro.message
        });
    }
});

//Exercício 2 - Pedidos

function validarDadoPedido(cliente, valor){
    if(!cliente || valor === undefined){
        return 'Cliente e valor são obrigatórios.'
    }

    if(typeof valor !== 'number' || valor <= 0){
        return 'Valor inválido.'
    }

    return null
};

app.post('/pedidos', async (req, res) => {
    try {

        const erro = validarDadoPedido(req.body);
        
        if(erro){
            return res.status(400).json({
                sucesso: false,
                mensagem: erro
            })
        }

        const novoPedido = {
            cliente: cliente.trim(),
            valor,
        }

        const pedidoCriado = await queryAsync("INSERT INTO pedido SET ?", [novoPedido])

        res.status(201).json({
            sucesso: true,
            mensagem: 'Pedido cadastrado com sucesso!',
            id: pedidoCriado.insertId
        })
    } catch (erro) {
        console.error('Erro ao salvar pedido.', erro);
        
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao salvar pedido.',
            erro: erro.message
        });
    }
});

//Exercício 3 - Salas

function validarDadosSala(dados, res){
    if(Object.keys(dados).length === 0){
        res.status(400).json({
            sucesso: false,
            mensagem: 'Nenhum dado enviado.'
        })
        return false
    } else {
        return true
    }
};

app.put('/salas/:id', async (req, res) => {
    try {
        const {id} = req.params
        const dados = req.body

        validarID(ID);

        const sala = await queryAsync("SELECT * FROM sala WHERE id = ?", [id])
        if (!validarExistencia(sala, res, 'Sala')) {
            return
        };
        
        const salaAtualizada = {}
        if(!validarDadosSala(dados, res) !== true) {
            salaAtualizada.dados
        } else {
            return 'Dados são obrigatórios.'
        }
        
        await queryAsync("UPDATE sala SET ? WHERE id = ?", [dados, id])
        res.status(201).json({
            sucesso: true,
            mensagem: 'Informações alteradas com sucesso.'
        });

    } catch (erro) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao alterar informações da sala.',
            erro: erro.message
        });
    }
});

app.delete('/salas/:id', async (req, res) => {
    try {
        const {id} = req.params
        
        validarID(ID);

        const salaExiste = await queryAsync("SELECT * FROM sala WHERE id = ?", [id])

        if (salaExiste.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sala não encontrada.'
            });
        }

        await queryAsync("DELETE FROM sala WHERE id = ?", [id])
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

module.exports = app