/* eslint-disable max-len */
const CollaborationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { collaborationServices, playlistServices, validator }) => {
    const collaborationHandler = new CollaborationHandler(collaborationServices, playlistServices, validator);
    server.route(routes(collaborationHandler));
  },
};
