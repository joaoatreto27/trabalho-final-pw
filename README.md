# Trabalho Final PW

## Descrição

Este é o projeto final da disciplina de Programação Web, que consiste em um sistema de gerenciamento de fornecedores e produtos. O sistema permite o cadastro, edição, visualização e exclusão de fornecedores e produtos.

## Requisitos

- Node.js
- XAMPP
- MySQL
- npm

## Instalação

### 1. Instalando Dependências

Para instalar as dependências do projeto, basta executar o comando abaixo, para isso vai ser necessário ter instalado o [Node.JS](https://nodejs.org/en)

```
npm install
```

### 2. Configurar o Banco de Dados

#### Instalar XAMPP

Baixe e instale o XAMPP para executar o servidor MySQL localmente: [XAMPP](https://www.apachefriends.org/pt_br/download.html)

### Configurar Variáveis de Ambiente

Crie um arquivo .env na pasta raiz do projeto, para definir as variáveis necessárias para o banco de dados MySQL:

```
DB_HOST=localhost
DB_USER=root
DB_NAME=trabalho_pw
```

#### Criando o banco de dados

Após a instalação do XAMPP, no painel de controle inicie o servidor MySQL, é possível visualizar o MySQL acessando http://localhost/phpmyadmin, depois de iniciar o MySQL basta executar o comando abaixo para criar o banco de dados:

```
npm create_database.js
```

## 3. Executando o projeto

Para iniciar o servidor Node basta executar o comando abaixo:

```
node app.js
```

Para acessar o aplicativo basta acessar http://localhost:3000

Para acessar a aplicação na tela de login, basta usar 'admin' para senha e para usuário