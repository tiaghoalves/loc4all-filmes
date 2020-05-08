require('dotenv').config()
import { expect } from 'chai';
import assert from 'assert'
import request from 'supertest'
import { connection } from './../db';
const api = request('http://localhost:3000/api')
let token;

describe('User', () => {
	describe('POST /auth/signup', () => {
		before(() => {
			connection.query('DELETE FROM user WHERE ?', [{ email: 'teste@teste.com' }])
		});

		it('Deve cadastrar um usuario teste com sucesso', (done) => {
			api.post('/auth/signup')
					.send({ email: 'teste@teste.com', password: 'test', name: 'Testerson Test' })
					.set('Accept', 'application/json')
					.expect(201)
					.end((err, res) => {
						if (err) return done(err);
						const user = res.body;

						expect(user).to.be.instanceof(Object);
						expect(user.password).not.to.be.equals('test');
						done();
					});
		});
	});

	describe('POST /auth/login', () => {
		it('Deve fazer login um usuario teste com sucesso', (done) => {
			api.post('/auth/login')
					.send({ email: 'teste@teste.com', password: 'test' })
					.set('Accept', 'application/json')
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);
						token = res.body.token;
						expect(res.body).to.have.property('user');
						expect(res.body).to.have.property('token');
						expect(res.body.user.password).not.to.be.equals('test');
						done();
					});
		});
	});

	describe('GET /auth/logout', () => {
		it('Deve fazer logout um usuario teste com sucesso', (done) => {
			api.get('/auth/logout')
					.set('x-access-token', token)
					.set('Accept', 'application/json')
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);

						expect(res.body).to.have.property('token');
						expect(res.body.token).to.be.equals(null);
						done();
					});
		});
	});
});