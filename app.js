const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
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
        console.log('Credenciais inválidas. Por favor, tente novamente.');
        res.redirect('/index.html');
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
    const search = req.query.search || '';
    let query = 'SELECT * FROM fornecedor';
    if (search) {
        query += ` WHERE nome LIKE '%${search}%' OR cnpj LIKE '%${search}%'`;
    }
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar fornecedores:', err);
            return;
        }
        res.json(results);
    });
});

app.get('/fornecedores/:id', (req, res) => {
    const fornecedorId = req.params.id;
    db.query('SELECT * FROM fornecedor WHERE id = ?', [fornecedorId], (err, result) => {
        if (err) {
            console.error('Erro ao buscar fornecedor:', err);
            res.status(500).send('Erro ao buscar fornecedor.');
        } else {
            res.json(result[0]);
        }
    });
});

// Atualizar Fornecedor
app.put('/fornecedores/:id', (req, res) => {
    const fornecedorId = req.params.id;
    const { nome, cnpj, email, telefone, cidade, uf, endereco } = req.body;
    const query = `
        UPDATE fornecedor SET nome = ?, cnpj = ?, email = ?, telefone = ?, cidade = ?, uf = ?, endereco = ?
        WHERE id = ?
    `;
    db.query(query, [nome, cnpj, email, telefone, cidade, uf, endereco, fornecedorId], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar fornecedor:', err);
            res.status(500).send('Erro ao atualizar fornecedor.');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Fornecedor não encontrado.');
        } else {
            res.status(200).send('Fornecedor atualizado com sucesso.');
        }
    });
});


// Excluir Fornecedor
app.delete('/fornecedores/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM fornecedor WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir fornecedor:', err);
            res.status(500).send('Erro ao excluir fornecedor.');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('Fornecedor não encontrado.');
        } else {
            res.status(204).send();
        }
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
    const search = req.query.search || '';
    let query = `
        SELECT produto.*, fornecedor.nome AS fornecedor_nome 
        FROM produto 
        JOIN fornecedor ON produto.fornecedor = fornecedor.id
    `;
    if (search) {
        query += ` WHERE produto.nome LIKE '%${search}%' OR fornecedor.nome LIKE '%${search}%'`;
    }
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            return;
        }
        res.json(results);
    });
});

// Excluir Produto
app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM produto WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir produto:', err);
            res.status(500).send('Erro ao excluir produto.');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('Produto não encontrado.');
        } else {
            res.status(204).send();
        }
    });
});

// Atualizar Produto
app.put('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, preco, quantidade, descr } = req.body;
    const query = 'UPDATE produto SET nome = ?, preco = ?, quantidade = ?, descr = ? WHERE id = ?';
    db.query(query, [nome, preco, quantidade, descr, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar produto:', err);
            res.status(500).send('Erro ao atualizar produto.');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('Produto não encontrado.');
        } else {
            res.status(200).send('Produto atualizado com sucesso.');
        }
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
        res.redirect('/fornecedores.html');
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
        res.redirect('/produtos.html');
        console.log('Produto cadastrado com sucesso!');
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = app;
