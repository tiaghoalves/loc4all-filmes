import { userService } from './../../services';

/** UserRoutes
 * @method userRoutes
 * @param {Object} server - Dependencias do servidor
 */
const userRoutes = server => {

	/**
	 * Rota de login de usuário
	 * @param {body} email
	 * @param {body} password
	 * @returns {res} - usuário e token
	 */
	server.post('/auth/login', async (req, res, next) => {
		const { email, password } = req.body;

		try {
			const user = await userService().findUserByEmail(email);
			const isMatch = await userService().comparePassword(user, password);

			if (isMatch) {
				const token = await userService().authenticate(email);
				req.headers['x-access-token'] = token;

				res.send(200, { user: user, token: token });
			} else {
				res.send(401, "Não autorizado");
			}
		} catch (error) {
			res.send(404, error);
		}

		next()
	})

	/**
	 * Rota de signup de usuário
	 * @param {body} name
	 * @param {body} email
	 * @param {body} password
	 * @returns {res} - dados do usuário salvo
	 */
	server.post('/auth/signup', async (req, res, next) => {
		const user = req.body;
		try {
			const userSaved = await userService().save(user);

			res.send(201, { user: userSaved });
		} catch (error) {
			res.send(404, error);
		}

		next()
	});

	/**
	 * Rota de logout do usuário
	 * Token deve ser apagado no storage do lado do client ao chamar essa rota de logout
	 * @requires x-access-token - Token fornecido ao fazer login
	 * @returns {res} - mensagem de sucesso e token null
	 */
	server.get('/auth/logout', (req, res, next) => {
		const name = req.decoded.name;

		if(req.decoded) {
			req.decoded = undefined; // Exclui as informações do token informado nos headers
			res.send(200, { token: null });
		} else {
			res.sendStatus(401);
		}

		next()
	})

};

export default userRoutes