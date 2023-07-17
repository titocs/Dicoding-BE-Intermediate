/* eslint-disable max-len */
const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { playlistServices, playlistActivitiesServices, validator }) => {
    const playlistHandler = new PlaylistHandler(playlistServices, playlistActivitiesServices, validator);
    server.route(routes(playlistHandler));
  },
};
