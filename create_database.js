const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

connection.connect((err) => {
  if (err) {
    return console.error('Erro ao conectar ao servidor MySQL: ' + err.message);
  }
  console.log('Conectado ao servidor MySQL.');

  connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`, (err, results) => {
    if (err) {
      console.error('Erro ao criar o banco de dados: ' + err.message);
      return;
    }
    console.log('Banco de dados criado ou já existe.');

    connection.changeUser({ database: process.env.DB_DATABASE }, (err) => {
      if (err) {
        console.error('Erro ao selecionar o banco de dados: ' + err.message);
        return;
      }

      const createFornecedorTable = `
        CREATE TABLE IF NOT EXISTS fornecedor (
          id INT AUTO_INCREMENT,
          nome TEXT NOT NULL,
          cnpj TEXT NOT NULL,
          email TEXT NOT NULL,
          telefone TEXT NOT NULL,
          cidade TEXT NOT NULL,
          uf TEXT NOT NULL,
          endereco TEXT NOT NULL,
          PRIMARY KEY (id)
        )
      `;

      const createProdutoTable = `
        CREATE TABLE IF NOT EXISTS produto (
          id INT AUTO_INCREMENT,
          nome TEXT NOT NULL,
          preco TEXT NOT NULL,
          quantidade TEXT NOT NULL,
          fornecedor INT,
          img_prod TEXT NOT NULL,
          descr TEXT NOT NULL,
          PRIMARY KEY (id),
          FOREIGN KEY (fornecedor) REFERENCES fornecedor(id)
        )
      `;

      connection.query(createFornecedorTable, (err, results) => {
        if (err) {
          console.error('Erro ao criar a tabela fornecedor: ' + err.message);
          return;
        }
        console.log('Tabela fornecedor criada.');

        connection.query(createProdutoTable, (err, results) => {
          if (err) {
            console.error('Erro ao criar a tabela produto: ' + err.message);
            return;
          }
          console.log('Tabela produto criada.');

          connection.end((err) => {
            if (err) {
              return console.error('Erro ao fechar a conexão: ' + err.message);
            }
            console.log('Conexão encerrada.');
          });
        });
      });
    });
  });
});
