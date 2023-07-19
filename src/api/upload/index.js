const UploadHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { storageServices, albumServices, validator }) => {
    const uploadHandler = new UploadHandler(storageServices, albumServices, validator)
    server.route(routes(uploadHandler))
  }
}
