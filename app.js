const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');
const multer = require('multer');

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

app.get('/fornecedores.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'fornecedores.html'));
});

app.get('/fornecedores', (req, res) => {
    const query = 'SELECT * FROM fornecedor';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar fornecedores:', err);
            return;
        }
        res.json(results);
    });
});

app.get('/cadastro-produto.html', (req, res) => {
    const query = 'SELECT id, nome FROM fornecedor';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao consultar fornecedores:', err);
            return;
        }
        res.sendFile(path.join(__dirname, 'views', 'cadastro-produto.html'));
    });
});

app.get('/produtos.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'produtos.html'));
});

app.get('/produtos', (req, res) => {
    const query = 'SELECT * FROM produto';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            return;
        }
        res.json(results);
    });
});

app.get('/fornecedores', (req, res) => {
    const query = 'SELECT id, nome FROM fornecedor';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao consultar fornecedores:', err);
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
        }
        console.log('Fornecedor registrado com sucesso!');
        res.redirect('/central');
    });
});

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post('/register-product', upload.single('image'), (req, res) => {
    const { prod_name, price, qtd, provider, desc } = req.body;
    const imagePath = req.file.path.replace(/\\/g, '/').substring(6);

    const insertQuery = 'INSERT INTO produto (nome, preco, quantidade, fornecedor, img_prod, descr) VALUES (?, ?, ?, ?, ?, ?)';
    db.execute(insertQuery, [prod_name, price, qtd, provider, imagePath, desc], (err, results) => {
        if (err) {
            console.error('Erro ao inserir produto:', err);
            return;
        }
        res.redirect('/central');
        console.log('Produto cadastrado com sucesso!');
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
