const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const conn = require('./database/database');
const perguntaModel = require('./database/Pergunta');
const Resposta = require('./database/Resposta');

// Database
conn.authenticate()
    .then(() => {
        console.log("Conectado ao banco");
    })
    .catch(msgErro => {
        console.log(msgErro);
    })

// Configurando EJS como renderizador de html
app.set('view engine', 'ejs');

// Definindo uso de arquivos staticos
// Arquivos staticos são arquivos como CSS ou IMAGENS
app.use(express.static('public'))

// Configurando o body-parser no express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Definindo rotas
app.get("/", (req, res) => {
    perguntaModel.findAll({
        raw: true, order: [
            ['createdAt', 'DESC']
        ]
    }).then(perguntas => {
        res.render("index", { perguntas });
    });
});
app.get("/perguntar", (req, res) => {
    res.render("perguntar");
})
app.post("/salvarPergunta", (req, res) => {
    var titulo = req.body.tituloPergunta;
    var desc = req.body.descPergunta;
    perguntaModel.create({
        titulo,
        descricao: desc
    }).then(() => {
        res.redirect("/");
    });
});
app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    perguntaModel.findOne({
        where: { id: id }
    }).then((pergunta) => {
        if (pergunta != undefined) {

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['createdAt','DESC']
                ]
            }).then(respostas => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                });
            })

        } else {
            res.redirect("/");
        }
    })
})
app.post("/responder",(req,res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId);
    });
})

// Executando a aplicação em servidor local na porta 8080
app.listen(8080, () => {
    console.log("App rodando");
})