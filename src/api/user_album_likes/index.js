const UserAlbumLikesHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'userAlbumLikes',
  version: '1.0.0',
  register: async (server, { userAlbumLikesServices, albumServices }) => {
    const userAlbumLikesHandler = new UserAlbumLikesHandler(userAlbumLikesServices, albumServices)
    server.route(routes(userAlbumLikesHandler))
  }
}
