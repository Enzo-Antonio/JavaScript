// const pool = require('./config/database')
// pool.getConnection((err, connection) => { 
//     if(err){
//         console.error('Erro ao conectar ao banco de dados', err)
//         process.exit(1)
//     }
//     console.log('Conectado ao MySQL! =D')
//     connection.release()
// })

// app.listen(PORT, () => {
//     console.log('Servidor Rodando! =D')
// })

const app = require('./app');
const pool = require('./config/database');

const PORT = 3000;

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar no banco:', err);
        process.exit(1);
    }

    console.log('Conectado ao MySQL com sucesso! 🎉');
    connection.release();
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});