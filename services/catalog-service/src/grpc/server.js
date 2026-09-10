const { Showtime, Seat } = require('../../models');
const { logger, proto, grpc } = require('@movie/common');

const catalogProto = proto.loadProto("catalog.proto", "catalog");

async function getShowtime(call, callback) {
  const requestId = call.metadata.get('x-request-id')[0];
  try {
    const { showtimeId } = call.request;
    
    logger.info('gRPC getShowtime called', { requestId, showtimeId });

    const showtime = await Showtime.findByPk(showtimeId);

    if (!showtime) {
      logger.warn('Showtime not found', { requestId, showtimeId });
      return callback({ code: grpc.status.NOT_FOUND, message: 'Showtime not found' });
    }

    callback(null, {
      id: showtime.id,
      movieId: showtime.movieId,
      theaterId: showtime.theaterId,
      startTime: showtime.startTime.toISOString(),
      endTime: showtime.endTime.toISOString(),
      price: String(showtime.price),
    });
  } catch (err) {
    logger.error('gRPC getShowtime failed', { requestId, error: err.message });
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
}

async function getTheaterSeats(call, callback) {
  try {
    const { theaterId } = call.request;
    const seats = await Seat.findAll({ where: { theaterId } });

    callback(null, {
      seats: seats.map((seat) => ({
        id: seat.id,
        theaterId: seat.theaterId,
        seatNumber: seat.seatNumber,
        type: seat.type.toUpperCase(), 
      })),
    });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
}

function startGrpcServer() {
  const server = new grpc.Server();
  server.addService(catalogProto.CatalogService.service, {
    getShowtime,
    getTheaterSeats,
  });

  const port = process.env.CATALOG_GRPC_PORT || 50052;
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
    logger.info(`[Catalog Service] gRPC server listening on port ${port}`);
  });
}

module.exports = { startGrpcServer };