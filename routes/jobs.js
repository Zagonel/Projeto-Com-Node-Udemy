const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

router.get('/add', (req, res) => {
    res.render('add');
});


router.get('/view/:id', (req, res) => Job.findOne({
    where: { id: req.params.id }
}).then(job => {
    res.render('view', { job })
}).catch(erro => console.log(erro)));



router.post('/add', (req, res) => {

    let { title, salary, company, email, new_job, description } = req.body;

    Job.create({
            title,
            salary,
            company,
            email,
            new_job,
            description,
        })
        .then(() => res.redirect('/'))
        .catch(erro => console.log(erro));
});

module.exports = router;