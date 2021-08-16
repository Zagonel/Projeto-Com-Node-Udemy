const express = require('express');
const exphbs = require("express-handlebars");
const path = require("path");
const app = express();
const db = require('./db/connection');
const bodyParser = require('body-parser');
const Job = require('./models/Job');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const PORT = 3000;

app.listen(PORT, function() {
    console.log(`O express ta rodando na porta ${PORT}`);
});

app.use(bodyParser.urlencoded({ extended: true }));

// como é pra usar agora que o bodyParser esta despreciado.
//app.use(express.urlencoded({extended: true}));
//app.use(express.json())

//handle-bars

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//static folder
app.use(express.static(path.join(__dirname, 'public')));


// Conexão do banco de dados.
db
    .authenticate()
    .then(() => {
        console.log("Conectou no banco com sucesso!!!");
    })
    .catch(erro => {
        console.log("Erro ao conectar ao banco de dados!!", erro);
    });

//rotas
app.get('/', (req, res) => {

    let search = req.query.job;
    let query = '%' + search + '%';

    if (!search) {
        Job.findAll({
                order: [
                    ['createdAt', 'DESC']
                ]
            })
            .then(jobs => {
                res.render('index', { jobs });
            })
            .catch(erro => console.log(erro));
    } else {
        Job.findAll({
                where: {
                    title: {
                        [Op.like]: query
                    },
                },
                order: [
                    ['createdAt', 'DESC']
                ]
            })
            .then(jobs => {
                res.render('index', { jobs, search });
            })
            .catch(erro => console.log(erro));
    }
});

//rotas do jobs

app.use('/jobs', require('./routes/jobs'));