import { movieService } from './../../services';

/** MovieRoutes
 * @method movieRoutes
 * @param {Object} server - Dependencias do servidor
 */
const movieRoutes = server => {

	/**
	 * Rota que busca todos os filme disponiveis
	 * @requires x-access-token - Token nos headers fornecido ao fazer login
	 * @returns {res} - retorna os filmes
	 */
	server.get('/movies', async (req, res, next) => {
		try {
			const movies = await movieService().availableMoviesList();
			res.send(200, movies);
		} catch (error) {
			res.send(404, error);
		}

		next()
	});

	/**
	 * Método que aluga um filme pelo idMovie
	 * @requires x-access-token - Token nos headers fornecido ao fazer login
	 * @param {body} idMovie
	 * @returns {res} retorna mensagem de filme alugado
	 */
	server.post('/movie/rent', async (req, res, next) => {
		try {
			const idMovie = req.body.idMovie;
			const { name, id_user } = req.decoded;

			if (typeof idMovie == 'undefined' || !idMovie.trim()) {
				res.send(400, { error: "Parâmetro inválido" });
			} else {
				const movie = await movieService().findMovieById(idMovie);
				const title = await movieService().rentMovie(movie, id_user);

				res.send(200, { message: `${title} foi alugado por ${name}` });
			}
		} catch (error) {
			res.send(404, error);
		}

		next()
	});


	/**
	 * Método que faz a devolução de um filme pelo idMovie
	 * @requires x-access-token - Token nos headers fornecido ao fazer login
	 * @param {body} idMovie
	 * @returns {res} retorna mensagem de filme devolvido
	 */
	server.put('/movie/return', async (req, res, next) => {
		try {
			const idMovie = req.body.idMovie;
			const { name, id_user } = req.decoded;

			if (typeof idMovie == 'undefined' || !idMovie.trim()) {
				res.send(400, { error: "Parâmetro inválido" });
			} else {
				const movie = await movieService().findMovieById(idMovie);
				const title = await movieService().returnMovie(movie, id_user);

				res.send(200, { message: `${title} foi devolvido por ${name}` });
			}
		} catch (error) {
			res.send(404, error);
		}

		next()
	});

	/**
	 * Método que obtém todos os filmes que correspondem ao parâmetro title
	 * @requires x-access-token - Token nos headers fornecido ao fazer login
	 * @param {body} title
	 * @returns {res} retorna com os filmes
	 */
	server.post('/movie', async (req, res, next) => {
		try {
			const title = req.body.title;
			if (typeof title == 'undefined' || !title.trim()) {
				res.send(400, { error: "Parâmetro inválido" });
			} else {
				const movies = await movieService().findMovieByName(title);
				
				console.log(movies);

				res.send(200, { movies });
			}
		} catch (error) {
			res.send(404, error);
		}

		next()
	});
}

export default movieRoutes;