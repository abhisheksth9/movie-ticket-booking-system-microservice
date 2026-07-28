const { Op } = require("sequelize");

const { AppError } = require('@movie/common').errors;
const { errorMessages } = require('@movie/common').constants;
const { Theater, Seat } = require('../../models');

const { logger } = require("@movie/common").logger;

const getAllTheaters = async (req, res) => {
    const theaters = await Theater.findAll();
    logger.info("Theaters fetched successfully", {
        requestId: req.requestId,
        count: theaters.length,
    });
    res.status(200).json(theaters);
};

const getTheaterById = async (req, res) => {
    const theater = await Theater.findByPk(req.params.id);

    if (!theater) throw new AppError(errorMessages.THEATER.NOT_FOUND, 404);
    
    logger.info("Theater fetched successfully", {
        requestId: req.requestId,
        theaterId: theater.id,
    });
    res.status(200).json(theater);
};

const createTheater = async (req, res) => {
    const { name, location, totalSeats } = req.body;

    const existingTheater = await Theater.findOne({
        where: { name, location },
    });

    if (existingTheater) {
        logger.warn("Duplicate theater creation attempted", {
            requestId: req.requestId,
            name,
            location,
        });

        throw new AppError(errorMessages.THEATER.ALREADY_EXISTS, 409);
    }

    const theater = await Theater.create({ name, location, totalSeats });

    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = Math.ceil(totalSeats / rows.length);

    for (const row of rows) {
        for (let i = 1; i <= seatsPerRow; i++) {
            if (seats.length >= totalSeats) break;
            seats.push({
                theaterId: theater.id,
                seatNumber: `${row}${i}`,
                type: i <= 2 ? 'vip'
                    : i <= 4 ? 'premium'
                    : 'standard',
            });
        }
    }

    await Seat.bulkCreate(seats);
    logger.info("Theater created successfully", {
        requestId: req.requestId,
        theaterId: theater.id,
        name: theater.name,
        seatsGenerated: seats.length,
    });

    res.status(201).json({ ...theater.toJSON(), seatsGenerated: seats.length });
};

const getSeats = async (req, res) => {
    const theater = await Theater.findByPk(req.params.id);

    if (!theater) throw new AppError(errorMessages.THEATER.NOT_FOUND, 404);

    const seats = await Seat.findAll({
        where: { theaterId: req.params.id },
        order: [['seatNumber', 'ASC']],
    });

    logger.info("Theater seats fetched successfully", {
        requestId: req.requestId,
        theaterId: theater.id,
        seatCount: seats.length,
    });

    res.status(200).json({
        theater: theater.name,
        location: theater.location,
        totalSeats: theater.totalSeats,
        seats,
    });
};

module.exports = { getAllTheaters, getTheaterById, createTheater, getSeats };