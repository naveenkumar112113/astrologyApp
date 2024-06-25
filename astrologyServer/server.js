const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    database: 'astrology'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

app.post('/fetch-data', (req, res) => {
    const { option1, option2 } = req.body;
    const query = `SELECT po.porutham_name,porutham_type FROM matching_list ml
                INNER JOIN porutham po ON po.id = ml.porutham_id 
                WHERE boy_rasi_id = '${option1}' AND girl_rasi_id = '${option2}'`;

    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/fetch-options', (req, res) => {
    const query1 = 'SELECT id,natchathiram_name FROM natchathiram';

    const options = {};

    db.query(query1, (err, results1) => {
        if (err) throw err;
        options.option1 = results1;
        res.json(options);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
