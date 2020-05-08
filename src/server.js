/**
 * Index do servidor configurando todas as rotas e adicionando middlewares utilizados
*/
import restify from 'restify'
const server = restify.createServer()
import namespace from 'restify-namespace'
import logger from 'restify-logger';
import routes from './routes/routes'
import cors from './middleware/cors'
import jwtMiddleware from './middleware/jwtMiddleware'

const exclusions = ['/api/auth/login', '/api/auth/signup'];

// Add plugins restify
// add e configura o CORS
server.pre(cors.preflight);
server.use(cors.actual);
// ativando logger
server.use(logger('tiny'));
// parse dos headers Accept
server.use(restify.plugins.acceptParser(server.acceptable));
// parse do body das requests
server.use(restify.plugins.bodyParser());
// parse de query strings nos requests
server.use(restify.plugins.queryParser());
// Middleware jwt antes de qualquer rota. Excluindo as rotas de autenticação: '/api/auth/login' e '/api/auth/signup'
server.use(jwtMiddleware({ exclusions }));
// Criando namespace com prefix padrão: '/api'
namespace(server, '/api', () => {
	/**
	 * Chamando rotas disponiveis passando as dependencias
	 * @param {Object} server - Objeto que representa o server restify
	 */
	routes(server);
});

export default server;