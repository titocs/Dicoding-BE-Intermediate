const ExportHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { exportServices, playlistServices, validator }) => {
    const exportHandler = new ExportHandler(exportServices, playlistServices, validator)
    server.route(routes(exportHandler))
  }
}
