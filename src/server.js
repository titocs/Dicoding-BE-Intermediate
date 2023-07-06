/* eslint-disable no-console */
// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const ClientError = require('./exception/ClientError');

const albums = require('./api/album');
const AlbumServices = require('./services/postgres/AlbumService');
const AlbumValidator = require('./validator/album');

const songs = require('./api/song');
const SongServices = require('./services/postgres/SongService');
const SongValidator = require('./validator/song');

const init = async () => {
  const albumServices = new AlbumServices();
  const songServices = new SongServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumServices,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songServices,
        validator: SongValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
