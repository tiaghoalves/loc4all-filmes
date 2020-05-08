/**
 * Middleware que habilita o CORS no servidor
 */
import corsMiddleware from 'restify-cors-middleware';

const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ['*'],
  allowHeaders: ['*', 'x-access-token'],
  exposeHeaders: ['*']
})

export default cors;