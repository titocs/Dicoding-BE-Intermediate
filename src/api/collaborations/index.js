/* eslint-disable max-len */
const CollaborationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, {
    collaborationServices, playlistServices, userServices, validator,
  }) => {
    const collaborationHandler = new CollaborationHandler(collaborationServices, playlistServices, userServices, validator);
    server.route(routes(collaborationHandler));
  },
};
