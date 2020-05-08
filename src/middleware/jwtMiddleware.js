/**
 * Middleware JWT para garantir que todas as requições possuam um token com exceção autenticação
 */
import jwt from 'jsonwebtoken';

const jwtMiddleware = (deps) => {
  return async (req, res, next) => {
    if (!deps.exclusions.includes(req.href())) {
		const token = req.headers['x-access-token']

		if (!token) {
			return res.send(403, { error: 'Token não fornecido' })
		}

      	try {
        	req.decoded = jwt.verify(token, process.env.JWT_SECRET)
      	} catch (error) {
        	return res.send(403, { error: 'Falha ao autenticar o token' })
    	}
    }

    next()
  }
}

module.exports = jwtMiddleware