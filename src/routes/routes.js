/**
 * Definição das rotas disponíveis
 */
import userRoute from './user/userRoute'
import movieRoute from './movie/movieRoute'

/**
 * Iniciando todas rotas disponíveis e injetando as dependencias do servidor
 * @param {Object} deps - dependencias passado pelo servidor
 */
const routes = (server) => {
	userRoute(server);
	movieRoute(server);

	server.get('/', (req, res, next) => {
		res.send('Rotas da api disponíveis em /api')
		next();
	});
};

export default routes;