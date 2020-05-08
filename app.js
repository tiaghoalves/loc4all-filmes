/**
 * Iniciando o servidor importando os principais modulos bem como outras configurações necessárias para subir o servidor
 */
require('dotenv').config()
import config from './config'
import server from './src/server'

// Subindo servidor na porta configurada em config
server.listen(config.port, () => {
    console.log(`Server running on http://${config.host}:${config.port}/`);
});
