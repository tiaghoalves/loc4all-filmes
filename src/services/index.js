import { connection } from './../../db'

const errorHandler = (error, msg, rejectFunction) => {
	if (error) console.error(error);

	rejectFunction({ error: msg });
}

const dependencies = { connection, errorHandler }

const userService = require('./user/userService')(dependencies)
const movieService = require('./movie/movieService')(dependencies)

module.exports = {
	userService: () => userService,
	movieService: () => movieService
}