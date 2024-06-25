process.env.NODE_ENV = 'test';

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js'; // Importando como exportação padrão
const { expect } = chai;

chai.use(chaiHttp);

describe('Teste de CRUD', () => {

    // Teste para cadastro de fornecedor
    describe('POST /register', () => {
        it('deve cadastrar um novo fornecedor', (done) => {
            const novoFornecedor = {
                name: 'Fornecedor Teste',
                cnpj: '12.345.678/0001-99',
                email: 'teste@fornecedor.com',
                phone: '(55) 12345-6789',
                city: 'Cidade Teste',
                uf: 'TT',
                address: 'Rua Teste, 123'
            };

            chai.request(app)
                .post('/register')
                .send(novoFornecedor)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    // Teste para buscar produtos
    describe('GET /produtos', () => {
        it('deve retornar uma lista de produtos', (done) => {
            chai.request(app)
                .get('/produtos')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

});
