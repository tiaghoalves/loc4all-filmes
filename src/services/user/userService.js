
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from './../../../config'
const SALT_ROUNDS = config.salt;

const user = deps => {
	const { connection, errorHandler } = deps;

	return {
		save: (user) => {
			const hashPassword = (password) => {
				return new Promise((resolve, reject) => {
					// Gerando salt para hash usado o número de SALT_ROUNDS
					bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
						if (err) {
							errorHandler(err, 'Falha ao gerar salt', reject);
							return false;
						}

						// Gerando hash bcrypt da senha com salt gerado
						bcrypt.hash(password, salt, (err, hash) => {
							if (err) {
								errorHandler(err, 'Falha ao gerar hash', reject)
								return false;
							}

							resolve(hash)
						});
					})
				})
			}

			return new Promise((resolve, reject) => {
				connection.query('SELECT * FROM user WHERE ? ', [{ email: user.email }], (error, results) => {
					if (error) return errorHandler(error, 'Falha ao buscar usuário', reject);
					// if length == 0 user email não existe ainda
					if (!(results.length > 0)) {
						hashPassword(user.password).then((passwordHash) => {
							user.password = passwordHash;

							connection.query('INSERT INTO user SET ?', [ user ], (err, result) => {
								if (err) {
									errorHandler(err, 'Falha ao inserir usuário', reject)
									return false;
								}

								resolve(user)
							});
						})
					} else {
						errorHandler(error, 'Email já existe', reject);
						return false
					}
				})
			})
		},
		authenticate: (email) => {
			return new Promise((resolve, reject) => {
				// Busca id, nome e email do usuario com pelo Email. Porque email tem tipo UNIQUE no bd
				connection.query('SELECT id_user, email, name FROM user WHERE ?', [{ email: email }], (err, results) => {
					if (err || !results.length) {
						errorHandler(err, 'Falha ao buscar o usuário', reject)
						return false;
					}
					// Usando apenas o id_user e email para gerar token
					const { id_user, email, name } = results[0];
					// Gerando token com 24 houras de duração e parametros nas configs
					const token = jwt.sign(
						{ email, id_user, name },
						config.secret,
						{ expiresIn: "1d" }
					);

					// Retorna o token criado
					resolve(token);
				})
			})
		},
		comparePassword: (user, password) => {
			return new Promise((resolve, reject) => {
				// Comparando hash das senhas
				bcrypt.compare(password, user.password, (err, isMatch) => {
					if (err) {
						errorHandler(err, 'Falha ao comparar hash bcrypt', reject)
						return false;
					}
					// Retorna isMatch = true quando os hashs são iguais
					resolve(isMatch)
				});
			})
		},
		findUserByEmail: (email) => {
			return new Promise((resolve, reject) => {
				connection.query('SELECT * FROM user WHERE ?', [{email: email}], (err, user) => {
					if (err) {
						errorHandler(err, 'Falha ao buscar usuário por email', reject)
						return false;
					}

					if (user.length > 0) {
						resolve(user[0]);
					} else {
						errorHandler(err, 'Usuário não encontrado', reject)
						return false;
					}
				})
			})
		}
	}
};

module.exports = user