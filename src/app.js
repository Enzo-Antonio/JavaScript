import express from 'express'
const app = express()
app.use(express.json())
const musicas = [
    {
        id: 233,
        "titulo": "Feet Don't Fail Me Now",
        "cantor": "Joy Crookes",
        "genero": "Soul",
        "data_lancamento": "2021",
    }
]

function buscarMusica(id) {
    return musicas.findIndex(m => {
        return m.id === Number(id)
    })
}

app.get("/", (req,res) => {
    res.status(200).send("CRUD Musicas")
})

app.get("/musicas", (req,res) => {
    res.status(200).json(musicas)
})

app.get("/musicas/:id", (req,res) => {
    const index = buscarMusica(req.params.id)
    res.status(200).json(musicas[index])
})

app.post("/musicas", (req,res) => {
    musicas.push(req.body)
})

export default app