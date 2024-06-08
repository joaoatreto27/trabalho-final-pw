const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL.');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/login', (req, res) => {
    const { user, password } = req.body;
    if (user === 'admin' && password === 'admin') {
        res.redirect('/central');
    } else {
        res.send('Credenciais inválidas. Por favor, tente novamente.');
    }
});

app.get('/central', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'central.html'));
});

app.get('/cadastro-fornecedor.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cadastro-fornecedor.html'));
});

app.get('/cadastro-produto.html', (req, res) => {
    const query = 'SELECT id, nome FROM fornecedor';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao consultar fornecedores:', err);
            res.status(500).send('Erro ao carregar fornecedores.');
            return;
        }
        res.sendFile(path.join(__dirname, 'views', 'cadastro-produto.html'));
    });
});

app.get('/fornecedores', (req, res) => {
    const query = 'SELECT id, nome FROM fornecedor';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao consultar fornecedores:', err);
            res.status(500).json({ error: 'Erro ao consultar fornecedores.' });
            return;
        }
        res.json(results);
    });
});

app.post('/register', (req, res) => {
    const { name, cnpj, email, phone, city, uf, address } = req.body;
    const query = 'INSERT INTO fornecedor (nome, cnpj, email, telefone, cidade, uf, endereco) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.execute(query, [name, cnpj, email, phone, city, uf, address], (err, results) => {
        if (err) {
            console.error('Erro ao inserir dados no banco de dados:', err);
            return res.status(500).send('Erro ao registrar fornecedor.');
        }
        console.log('Fornecedor registrado com sucesso!');
        res.redirect('/central');
    });
});

app.post('/register-product', (req, res) => {
    const { prod_name, price, qtd, provider, desc } = req.body;
    const insertQuery = 'INSERT INTO produto (nome, preco, quantidade, fornecedor, descr) VALUES (?, ?, ?, ?, ?)';
    db.execute(insertQuery, [prod_name, price, qtd, provider, desc], (err, results) => {
        if (err) {
            console.error('Erro ao inserir produto:', err);
            res.status(500).send('Erro ao cadastrar produto.');
            return;
        }
        res.send('Produto cadastrado com sucesso!');
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
