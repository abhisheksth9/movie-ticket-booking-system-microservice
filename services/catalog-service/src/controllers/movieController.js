const { Op } = require("sequelize");
const { Movie } = require("../../models");
const { sendNotification } = require("../utils/notificationService");

const getAllMovies = async (req, res) => {
    const movies = await Movie.findAll();
    res.status(200).json(movies);
};

const getMovieById = async (req, res) => {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
        return res.status(404).json({
            message: "Movie not found",
        });
    }

    res.status(200).json(movie);
};

const createMovie = async (req, res) => {
    const { title, description, duration, genre, language } = req.body;

    if (!title || !duration) {
        res.status(400);
        throw new Error("Title and duration are required.");
    }

    const existingMovie = await Movie.findOne({
        where: { title },
    });

    if (existingMovie) {
        res.status(409);
        throw new Error("Movie already exists.");
    }

    const movie = await Movie.create({
        title,
        description,
        duration,
        genre,
        language,
    });

    await sendNotification({
        recipientRole: "admin",
        type: "MOVIE_CREATED",
        message: `New movie "${movie.title}" has been added.`,
        data: {
            movieId: movie.id,
            title: movie.title,
            duration: movie.duration,
            genre: movie.genre,
            language: movie.language,
        },
    });

    res.status(201).json(movie);
};

const updateMovie = async (req, res) => {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
        return res.status(404).json({
            message: "Movie not found",
        });
    }

    const { title, description, duration, genre, language } = req.body;

    if (title) {
        const duplicateMovie = await Movie.findOne({
            where: {
                title,
                id: {
                    [Op.ne]: movie.id,
                },
            },
        });

        if (duplicateMovie) {
            res.status(409);
            throw new Error("Another movie with this title already exists.");
        }
    }

    await movie.update({
        title: title || movie.title,
        description: description || movie.description,
        duration: duration || movie.duration,
        genre: genre || movie.genre,
        language: language || movie.language,
    });

    await sendNotification({
        recipientRole: "admin",
        type: "MOVIE_UPDATED",
        message: `Movie "${movie.title}" has been updated.`,
        data: {
            movieId: movie.id,
            title: movie.title,
        },
    });

    res.status(200).json(movie);
};

const deleteMovie = async (req, res) => {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
        return res.status(404).json({
            message: "Movie not found",
        });
    }

    const { id, title } = movie;

    await movie.destroy();

    await sendNotification({
        recipientRole: "admin",
        type: "MOVIE_DELETED",
        message: `Movie "${title}" has been deleted.`,
        data: {
            movieId: id,
            title,
        },
    });

    res.status(200).json({
        message: "Movie deleted successfully.",
    });
};

module.exports = { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie };