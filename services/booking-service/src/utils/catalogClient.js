// const createHttpClient = require('./httpClient');

// const catalogClient = createHttpClient(
//     process.env.CATALOG_SERVICE_URL
// );

// const getShowtime = async(showtimeId) => {
//     try {
//         const {data} = await catalogClient.get(`/api/catalog/showtimes/internal/${showtimeId}`);
//         return data;
//     } catch (err) {
//         if (err.response?.status === 404) return null;
//         throw new Error(`Catalog Service unreachable: ${err.message}`);
//     }
// };

// const getTheaterSeats = async(theaterId) => {
//     try {
//         const { data } = await catalogClient.get(`/api/catalog/theaters/internal/${theaterId}/seats`)
//         return data.seats;
//     } catch (err) {
//         if (err.response?.status === 404) return [];
//         throw new Error(`Catalog Service unreachable: ${err.message}`);
//     }
// };

// module.exports = { getShowtime, getTheaterSeats };