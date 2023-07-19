/* eslint-disable max-len */
const PlaylistActivitiesHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'playlistActivities',
  version: '1.0.0',
  register: async (server, { playlistActivitiesServices, playlistServices }) => {
    const playlistActivitiesHandler = new PlaylistActivitiesHandler(playlistActivitiesServices, playlistServices)
    server.route(routes(playlistActivitiesHandler))
  }
}
