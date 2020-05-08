require('dotenv').config()
import { expect } from 'chai';
import assert from 'assert'
import request from 'supertest'
import { connection } from './../db'
const api = request('http://localhost:3000/api')
let token = '';

describe('Movie', () => {
	// Antes de cada teste dentro de /movie(s) deve ser feito autenticação guardando o token para outras requisições
	beforeEach('POST /auth/login - login e guardando token de usuatio teste', (done) => {
		api.post('/auth/login')
			.send({ email: 'test@test.com', password: 'teste' })
			.set('Accept', 'application/json')
			.expect(200)
			.end((err, res) => {
				if (err) done(err);

				token = res.body.token;
				done();
			});
	});

	describe('GET /movies', () => {
		it('Deve buscar todos os filme disponiveis', (done) => {
			api.get('/movies')
					.set('x-access-token', token)
					.set('Accept', 'application/json')
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);
						const movies = res.body;

						expect(movies).to.be.instanceof(Array);
						done();
					});
		});
	});

	describe('POST /movie/rent', () => {
		it('Deve alugar um filme pelo id autenticado como usuário teste', (done) => {
			api.post('/movie/rent')
					.set('x-access-token', token)
					.send({ idMovie: '1' })
					.expect('Content-Type', /json/)
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);

						expect(res.body).to.have.property('message');
						done();
					});
		});
	});

	describe('PUT /movie/return', () => {
		it('Deve devolver um filme pelo id autenticado como usuário teste', (done) => {
			api.put('/movie/return')
					.set('x-access-token', token)
					.send({ idMovie: '1' })
					.expect('Content-Type', /json/)
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);

						expect(res.body).to.have.property('message');
						done();
					});
		});
	});

	describe('POST /movie', () => {
		it('Deve pesquisar um filme pelo titulo: Avengers', (done) => {
			api.post('/movie')
					.set('x-access-token', token)
					.send({ title: 'Avengers' })
					.expect('Content-Type', /json/)
					.expect(200)
					.end((err, res) => {
						if (err) return done(err);

						expect(res.body).to.have.property('movies');
						done();
					});
		});
	});
});