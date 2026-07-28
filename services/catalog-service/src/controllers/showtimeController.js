const { Op } = require('sequelize');
const { Showtime, Movie, Theater } = require('../../models');

const { logger } = require("@movie/common").logger;
const { AppError } = require('@movie/common').errors;
const { errorMessages } = require('@movie/common').constants;

const BUFFER_MINUTES = 15;

const getAllShowtimes = async (req, res) => {
    const showtimes = await Showtime.findAll();

    logger.info("Showtimes fetched successfully", {
        requestId: req.requestId,
        count: showtimes.length,
    });

    res.status(200).json(showtimes);
};

const getShowtimebyId = async (req, res) => {
    const showtime = await Showtime.findByPk(req.params.id);

    if (!showtime) {
        throw new AppError(errorMessages.SHOWTIME.NOT_FOUND, 404);
    }

    logger.info("Showtime fetched successfully", {
        requestId: req.requestId,
        showtimeId: showtime.id,
    });

    res.status(200).json(showtime);
};

const createShowtime = async (req, res) => {
    const { movieId, theaterId, startTime, endTime, price } = req.body;

    const movie = await Movie.findByPk(movieId);
    if (!movie) throw new AppError(errorMessages.MOVIE.NOT_FOUND, 404);

    const theater = await Theater.findByPk(theaterId);
    if (!theater) throw new AppError(errorMessages.THEATER.NOT_FOUND, 404);

    const newStart = new Date(startTime);
    const newEnd = new Date(endTime);

    if (newStart >= newEnd) throw new AppError(errorMessages.SHOWTIME.INVALID_TIME_RANGE, 400);

    const bufferedStart = new Date(newStart.getTime() - BUFFER_MINUTES * 60000);
    const bufferedEnd = new Date(newEnd.getTime() + BUFFER_MINUTES * 60000);

    const conflictingShowtime = await Showtime.findOne({
        where: {
            theaterId,
            [Op.and]: [
                { startTime: { [Op.lt]: bufferedEnd } },
                { endTime: { [Op.gt]: bufferedStart } },
            ],
        },
        include: [{ model: Movie, attributes: ['title'] }],
    });

    if (conflictingShowtime) {
        logger.warn("Conflicting showtime creation attempted", {
            requestId: req.requestId,
            theaterId,
            conflictingShowtimeId: conflictingShowtime.id,
        });

        throw new AppError(errorMessages.SHOWTIME.INVALID_TIME_RANGE, 409);
    }

    const showtime = await Showtime.create({ movieId, theaterId, startTime, endTime, price });

    res.status(201).json(showtime);
};

const deleteShowtime = async (req, res) => {
    const showtime = await Showtime.findByPk(req.params.id);
    if (!showtime) throw new AppError(errorMessages.SHOWTIME.NOT_FOUND, 404);

    await showtime.destroy();
    logger.info("Showtime deleted successfully", {
        requestId: req.requestId,
        userId: req.user?.id,
        role: req.user?.role,
        showtimeId: showtime.id,
    });
    res.status(200).json({ message: 'Showtime deleted successfully' });
};

module.exports = { getAllShowtimes, getShowtimebyId, createShowtime, deleteShowtime };
