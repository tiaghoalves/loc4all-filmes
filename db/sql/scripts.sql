-- SCRIPTS DE CRIAÇÃO DO BANCO DE DADOS DA LOCADORA LOC4LL FILMES
-- CRIANDO BANCO DE DADOS COM NOME 'LOC4LL_FILMES_DB'
CREATE DATABASE IF NOT EXISTS LOC4LL_FILMES_DB;
USE LOC4LL_FILMES_DB;

-- TABELA USER
CREATE TABLE IF NOT EXISTS `user` (
  `id_user` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id_user`)
);

-- TABELA MOVIE
CREATE TABLE IF NOT EXISTS `movie` (
  `id_movie` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `director` VARCHAR(255) NOT NULL,
  `quantity_total` INT DEFAULT 1,
  `quantity_rent` INT DEFAULT 0,
  PRIMARY KEY (`id_movie`)
);

-- TABELA RENT_MOVIE
CREATE TABLE IF NOT EXISTS `rent_movie` (
  `id_rent_movie` INT NOT NULL AUTO_INCREMENT,
  `id_rent_movie_movie` INT NOT NULL,
  `id_rent_movie_user` INT NOT NULL,
  `rent_at` DATETIME NOT NULL,
  `return_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id_rent_movie`),
  CONSTRAINT `fk_rent_movie_movie`
    FOREIGN KEY (`id_rent_movie_movie`)
    REFERENCES `movie` (`id_movie`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_rent_movie_user`
    FOREIGN KEY (`id_rent_movie_user`)
    REFERENCES `user` (`id_user`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- INDEX
CREATE INDEX IDX_USER_EMAIL ON `user`(`email`);
CREATE INDEX IDX_MOVIE_TILE ON `movie`(`title`);
CREATE INDEX IDX_RENT_MOVIE_USER ON `rent_movie` (`id_rent_movie_user`);
CREATE INDEX IDX_RENT_MOVIE_MOVIE ON `rent_movie` (`id_rent_movie_movie`);

-- INSERTS USER
INSERT INTO `user`(`ID_USER`, `NAME`, `EMAIL`, `PASSWORD`) 
			VALUES (NULL, 'Teste', 'test@test.com', '$2a$04$04TA20t.53FCdcjUjXlsYuSNguJMtn/GzrsDzQC9AmVFlE.tX7eIq');

-- INSERTS MOVIE
INSERT INTO `movie`(`ID_MOVIE`, `TITLE`, `DIRECTOR`, `QUANTITY_TOTAL`, `QUANTITY_RENT`) VALUES (NULL, 'The Avengers', 'Joss Whedon', 4, 2);
INSERT INTO `movie`(`ID_MOVIE`, `TITLE`, `DIRECTOR`, `QUANTITY_TOTAL`, `QUANTITY_RENT`) VALUES (NULL, 'Avengers: Age of Ultron', 'Joss Whedon', 5, 0);            
INSERT INTO `movie`(`ID_MOVIE`, `TITLE`, `DIRECTOR`, `QUANTITY_TOTAL`, `QUANTITY_RENT`) VALUES (NULL, 'Avengers: Infinity War', 'Anthony Russo and Joe Russo', 5, 0);
INSERT INTO `movie`(`ID_MOVIE`, `TITLE`, `DIRECTOR`, `QUANTITY_TOTAL`, `QUANTITY_RENT`) VALUES (NULL, 'The Warriors', 'Walter Hill', 5, 0);
INSERT INTO `movie`(`ID_MOVIE`, `TITLE`, `DIRECTOR`, `QUANTITY_TOTAL`, `QUANTITY_RENT`) VALUES (NULL, 'Pulp Fiction', 'Quentin Tarantino', 3, 0);



SELECT * FROM `movie`;
SELECT * FROM `user`;
SELECT * FROM `rent_movie`;	




