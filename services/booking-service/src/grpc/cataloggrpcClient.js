const grpc = require("@grpc/grpc-js");
const { proto } = require("@movie/common");

const catalogProto = proto.loadProto("catalog.proto", "catalog");

const client = new catalogProto.CatalogService(
  process.env.CATALOG_GRPC_URL || 'localhost:50052',
  grpc.credentials.createInsecure()
);

function getShowtime(showtimeId) {
  return new Promise((resolve, reject) => {
    client.getShowtime({ showtimeId }, (err, response) => {
      if (err) {
        if (err.code === grpc.status.NOT_FOUND) return resolve(null);
        return reject(err);
      }
      resolve(response);
    });
  });
}

function getTheaterSeats(theaterId) {
  return new Promise((resolve, reject) => {
    client.getTheaterSeats({ theaterId }, (err, response) => {
      if (err) return reject(err);
      resolve(response.seats);
    });
  });
}

module.exports = { getShowtime, getTheaterSeats };