/* eslint-disable no-console */
// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const ClientError = require('./exception/ClientError');

const albums = require('./api/album');
const AlbumServices = require('./services/postgres/AlbumService');
const AlbumValidator = require('./validator/album');

const songs = require('./api/song');
const SongServices = require('./services/postgres/SongService');
const SongValidator = require('./validator/song');

const users = require('./api/user');
const UserServices = require('./services/postgres/UserService');
const UserValidator = require('./validator/user');

const authentications = require('./api/authentication');
const AuthenticationServices = require('./services/postgres/AuthenticationService');
const AuthenticationsValidator = require('./validator/authentication');
const TokenManager = require('./tokenize/TokenManager');

const playlists = require('./api/playlist');
const PlaylistServices = require('./services/postgres/PlaylistService');
const PlaylistValidator = require('./validator/playlist');

const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationService');
const CollaborationsValidator = require('./validator/collaboration');

const init = async () => {
  const collaborationsService = new CollaborationsService();
  const playlistServices = new PlaylistServices(collaborationsService);
  const albumServices = new AlbumServices();
  const songServices = new SongServices();
  const userServices = new UserServices();
  const authenticationServices = new AuthenticationServices();

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
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('musicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: users,
      options: {
        service: userServices,
        validator: UserValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistServices,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationServices,
        userServices,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistServices,
        validator: CollaborationsValidator,
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
      console.error(response.message);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
