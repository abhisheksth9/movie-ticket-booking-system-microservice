const { proto, grpc } = require("@movie/common");
const catalogProto = proto.loadProto("catalog.proto", "catalog");

const client = new catalogProto.CatalogService(
  process.env.CATALOG_GRPC_URL || 'localhost:50052',
  grpc.credentials.createInsecure()
);

function buildMetadata(requestId) {
  const metadata = new grpc.Metadata();
  if (requestId) {
    metadata.set('x-request-id', requestId);
  }
  return metadata;
}

function getShowtime(showtimeId, requestId) {
  return new Promise((resolve, reject) => {
    client.getShowtime({ showtimeId }, buildMetadata(requestId), (err, response) => {
      if (err) {
        if (err.code === grpc.status.NOT_FOUND) return resolve(null);
        return reject(err);
      }
      resolve(response);
    });
  });
}

function getTheaterSeats(theaterId, requestId) {
  return new Promise((resolve, reject) => {
    client.getTheaterSeats({ theaterId }, buildMetadata(requestId), (err, response) => {
      if (err) return reject(err);
      resolve(response.seats);
    });
  });
}

module.exports = { getShowtime, getTheaterSeats };