const { Showtime, Movie, Theater } = require('../../models');
const { Op } = require('sequelize');

const BUFFER_MINUTES = 15;

const getAllShowtimes = async (req, res) => {
    const showtimes = await Showtime.findAll();
    res.status(200).json(showtimes);
};

const getShowtimebyId = async (req, res) => {
    const showtime = await Showtime.findByPk(req.params.id);

    if (!showtime) return res.status(404).json({ message: "Showtime not found" });

    res.status(200).json(showtime);
};

const createShowtime = async (req, res) => {
    const { movieId, theaterId, startTime, endTime, price } = req.body;

    if (!movieId || !theaterId || !startTime || !endTime) {
        res.status(400);
        throw new Error("MovieId, TheaterId, Start Time, End Time and Price required");
    }
    if (price <= 0) {
        res.status(400);
        throw new Error("Price must be greater than zero");
    }

    const movie = await Movie.findByPk(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const theater = await Theater.findByPk(theaterId);
    if (!theater) return res.status(404).json({ message: "Theater not found" });

    const newStart = new Date(startTime);
    const newEnd = new Date(endTime);

    if (newStart >= newEnd) {
        res.status(400);
        throw new Error("startTime must be before endTime");
    }

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
        const formatTime = (date) => {
            return new Date(date).toLocaleString('en-US', {
                timeZone: 'UTC',
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        };

        return res.status(400).json({
            message: `Theater is already booked for '${conflictingShowtime.Movie.title}' from ${formatTime(conflictingShowtime.startTime)} to ${formatTime(conflictingShowtime.endTime)}. A ${BUFFER_MINUTES}-minutes gap is required between showtimes`,
            conflictingShowtime: {
                id: conflictingShowtime.id,
                movie: conflictingShowtime.Movie.title,
                startTime: conflictingShowtime.startTime,
                endTime: conflictingShowtime.endTime,
            },
        });
    }

    const showtime = await Showtime.create({ movieId, theaterId, startTime, endTime, price });

    res.status(201).json(showtime);
};

const deleteShowtime = async (req, res) => {
    const showtime = await Showtime.findByPk(req.params.id);
    if (!showtime) return res.status(404).json({ message: "Showtime not found" });

    await showtime.destroy();
    res.status(200).json({ message: 'Showtime deleted successfully' });
};

module.exports = { getAllShowtimes, getShowtimebyId, createShowtime, deleteShowtime };
