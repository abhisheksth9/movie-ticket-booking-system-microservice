const { Op } = require("sequelize");
const { Movie } = require("../../models");

const { errorMessages } = require("@movie/common").constants;
const { AppError } = require("@movie/common").errors;
const { logger } = require("@movie/common").logger;
const { sendNotification } = require("@movie/common").utils;


const getAllMovies = async (req, res) => {
    const movies = await Movie.findAll();

    logger.info("Movies fetched successfully", {
        requestId: req.requestId,
        count: movies.length,
    });
    res.status(200).json(movies);
};

const getMovieById = async (req, res) => {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
        throw new AppError(errorMessages.MOVIE.NOT_FOUND, 404);
    }

    logger.info("Movie fetched successfully", {
        requestId: req.requestId,
        movieId: movie.id,
    });

    res.status(200).json(movie);
};

const createMovie = async (req, res) => {
    const { title, description, duration, genre, language } = req.body;
    const existingMovie = await Movie.findOne({
        where: { title },
    });

    if (existingMovie) {
        logger.warn("Duplicate movie creation attempted", {
            requestId: req.requestId,
            title,
        });

        throw new AppError(errorMessages.MOVIE.ALREADY_EXISTS, 409);
    }

    const movie = await Movie.create({
        title,
        description,
        duration,
        genre,
        language,
    });

    logger.info("Movie created successfully", {
        requestId: req.requestId,
        movieId: movie.id,
        title: movie.title,
    });

    await sendNotification({
            recipientRole: "admin",
            type: "MOVIE_CREATED",
            message: `New movie "${movie.title}" has been added.`,
            data: {
                movieId: movie.id,
                title: movie.title,
                duration: movie.duration,
            },
        },
        req.requestId
    );

    res.status(201).json(movie);
};

const updateMovie = async (req, res) => {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) throw new AppError(errorMessages.MOVIE.NOT_FOUND, 404);

    const { title, description, duration, genre, language } = req.body;

    if (title) {
        const duplicateMovie = await Movie.findOne({
            where: {
                title,
                id: { [Op.ne]: movie.id },
            },
        });

        if (duplicateMovie) {
            logger.warn("Duplicate movie update attempted", {
                requestId: req.requestId,
                movieId: movie.id,
                title,
            });

            throw new AppError(errorMessages.MOVIE.ALREADY_EXISTS, 409);
        }
    }

    await movie.update({
        title: title || movie.title,
        description: description || movie.description,
        duration: duration || movie.duration,
        genre: genre || movie.genre,
        language: language || movie.language,
    });

    logger.info("Movie updated successfully", {
        requestId: req.requestId,
        movieId: movie.id,
        title: movie.title,
    });

    await sendNotification({
            recipientRole: "admin",
            type: "MOVIE_UPDATED",
            message: `Movie "${movie.title}" has been updated.`,
            data: {
                movieId: movie.id,
                title: movie.title,
            },
        },
        req.requestId
    );

    res.status(200).json(movie);
};

const deleteMovie = async (req, res) => {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) throw new AppError(errorMessages.MOVIE.NOT_FOUND, 404);

    const { id, title } = movie;

    await movie.destroy();

    logger.info("Movie deleted successfully", {
        requestId: req.requestId,
        movieId: id,
        title,
    });

    await sendNotification({
            recipientRole: "admin",
            type: "MOVIE_DELETED",
            message: `Movie "${title}" has been deleted.`,
            data: {
                movieId: id,
                title,
            },
        },
        req.requestId
    );

    res.status(200).json({
        message: "Movie deleted successfully.",
    });
};

module.exports = { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie };