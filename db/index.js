/*
 * Configurando conexão com banco de dados
*/
import config from './../config/index'

// Buscando as configurações de conexão com o banco
const connection = config.db.getConnection();

// Fazendo a conexão com o banco e tratando erros caso ocorram
connection.connect(function(err) {
    if (err) {
		console.error('error connecting database: ' + err.stack);
		return;
    }
});

module.exports = { connection }