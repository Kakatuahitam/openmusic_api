require('dotenv').config();

const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');
// const NotFoundError = require('./exceptions/NotFoundError');

const albums = require('./api/albums');
const AlbumsService = require('./services/psql/AlbumsService');
const AlbumsValidator = require('./validator/albums');

const songs = require('./api/songs');
const SongsService = require('./services/psql/SongsService');
const SongsValidator = require('./validator/songs');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register(
      {
        plugin: albums,
        options: {
          service: albumsService,
          validator: AlbumsValidator,
        },
      },
  );

  await server.register(
      {
        plugin: songs,
        options: {
          service: songsService,
          validator: SongsValidator,
        },
      },
  );

  server.ext('onPreResponse', (request, h) => {
    const {response} = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response(
            {
              status: 'fail',
              message: response.message,
            },
        );

        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      let errorMessage;

      if (process.env.NODE_ENV === 'production') {
        errorMessage = 'we are sorry, we have problem on our server';
      } else {
        errorMessage = response.message;
      }

      const newResponse = h.response(
          {
            status: 'error',
            message: errorMessage,
          },
      );

      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Serving on ${server.info.uri}`);
};

init();
