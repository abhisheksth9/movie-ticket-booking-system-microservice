const { Theater, Seat } = require('../../models');

const getAllTheaters = async (req, res) => {
    const theaters = await Theater.findAll();
    res.status(200).json(theaters);
};

const getTheaterById = async (req, res) => {
    const theater = await Theater.findByPk(req.params.id);

    if (!theater) return res.status(404).json({ message: "Theater not found" });

    res.status(200).json(theater);
};

const createTheater = async (req, res) => {
    const { name, location, totalSeats } = req.body;

    if (!name || !location || !totalSeats) {
        res.status(400);
        throw new Error("name, total Seats and location required");
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

    res.status(201).json({ ...theater.toJSON(), seatsGenerated: seats.length });
};

const getSeats = async (req, res) => {
    const theater = await Theater.findByPk(req.params.id);

    if (!theater) return res.status(404).json({ message: "Theater not found" });

    const seats = await Seat.findAll({
        where: { theaterId: req.params.id },
        order: [['seatNumber', 'ASC']],
    });

    res.status(200).json({
        theater: theater.name,
        location: theater.location,
        totalSeats: theater.totalSeats,
        seats,
    });
};

module.exports = { getAllTheaters, getTheaterById, createTheater, getSeats };
