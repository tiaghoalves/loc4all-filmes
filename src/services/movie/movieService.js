import userService from './../user/userService'
import { throws } from 'assert';

const movie = deps => {
	const { connection, errorHandler } = deps;

	return {
		availableMoviesList: () => {
			return new Promise((resolve, reject) => {
				connection.query('SELECT * FROM movie WHERE quantity_rent < quantity_total', (err, results) => {
					if (err) {
						errorHandler(err, 'Falha ao buscar usuário', reject);
						return false;
					}

					resolve(results);
				});
			})
		},
		findMovieByName: (title) => {
			return new Promise((resolve, reject) => {
				connection.query('SELECT * FROM movie WHERE title LIKE ?', [`%${title}%`], (err, movies) => {
					if (err) {
						errorHandler(err, 'Falha ao buscar filme', reject);
						return false;
					}

					if (movies) {
						resolve(movies);
					}
				});
			})
		},
		findMovieById: (idMovie) => {
			return new Promise((resolve, reject) => {
				connection.query('SELECT * FROM movie WHERE ?', [{ id_movie: idMovie }], (err, movie) => {
					if (err) {
						errorHandler(err, 'Falha buscar filme', reject);
						return false;
					}

					if (movie.length > 0) {
						resolve(movie[0]);
					} else {
						errorHandler(err, 'Filme não encontrado', reject);
						return false;
					}
				});
			});
		},
		rentMovie: (movie, idUser) => {
			return new Promise((resolve, reject) => {
				const rentMovie = {
					id_rent_movie_movie: movie.id_movie,
					id_rent_movie_user: idUser,
					rent_at: new Date()
				};

				if (movie.quantity_total >= (movie.quantity_rent + 1)) {
					connection.query('INSERT INTO rent_movie SET ?', [rentMovie], (err, rent) => {
						if (err) {
							errorHandler(err, 'Falha ao inserir locação do filme', reject);
							return false;
						}

						connection.query('UPDATE movie SET quantity_rent = quantity_rent + 1 WHERE ?', [{ id_movie: movie.id_movie }], (err, result) => {
							if (err) {
								errorHandler(err, 'Falha ao atualizar filme', reject);
								return false;
							}

							resolve(movie.title);
						})
					});
				} else {
					errorHandler(new Error('Máximo de copias locadas'), 'Não ha mais copias deste filme', reject);
					return false;
				}
			})
		},
		returnMovie: (movie, idUser) => {
			return new Promise((resolve, reject) => {
				connection.query('SELECT * FROM rent_movie WHERE ? AND ? AND return_at IS NULL',
					[{ id_rent_movie_movie: movie.id_movie }, { id_rent_movie_user: idUser }], (err, rentMovie) => {
					if (err) {
						errorHandler(err, 'Falha ao buscar filme alugado', reject);
						return false;
					}

					if(rentMovie.length > 0) {
						connection.query('UPDATE movie SET quantity_rent = quantity_rent - 1 WHERE ?', [{ id_movie: movie.id_movie }], (err, results) => {
							if (err) {
								errorHandler(err, 'Falha ao atualizar filme', reject);
								return false;
							}

							connection.query('UPDATE rent_movie SET ? WHERE id_rent_movie = ?',
							[{ return_at: new Date() }, rentMovie[0].id_rent_movie ], (err, result) => {
								if (err) {
									errorHandler(err, 'Falha ao atualizar filme alugado', reject);
									return false;
								}

								resolve(movie.title);
							})
						})
					} else {
						errorHandler(err, 'Filme não foi alugado', reject);
						return false;
					}
				})
			})
		}
	}
}

module.exports = movie