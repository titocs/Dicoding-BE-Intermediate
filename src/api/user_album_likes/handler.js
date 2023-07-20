/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
class UserAlbumLikesHandler {
  constructor (userAlbumLikesServices, albumServices) {
    this._userAlbumLikesServices = userAlbumLikesServices,
    this._albumServices = albumServices
  }

  async postLikesHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._albumServices.getAlbumsById(id)
    await this._userAlbumLikesServices.addLikes(credentialId, id)

    const response = h.response({
      status: 'success',
      message: 'Likes telah ditambahkan'
    })
    response.code(201)
    return response
  }

  async deleteLikesHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._userAlbumLikesServices.deleteLikes(id, credentialId)

    const response = h.response({
      status: 'success',
      message: 'Likes telah dihapus'
    })
    return response
  }

  async getLikesHandler (request, h) {
    const { id } = request.params
    const like = await this._userAlbumLikesServices.getLikes(id)

    const response = h.response({
      status: 'success',
      data: {
        likes: like.likes
      }
    })
    response.header('X-Data-Source', like.dataSource)
    return response
  }
}

module.exports = UserAlbumLikesHandler
