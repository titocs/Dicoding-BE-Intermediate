/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */

class AlbumHandler {
  constructor (service, validator) {
    this._service = service,
    this._validator = validator
  }

  async postAlbumHandler (request, h) {
    this._validator.validateAlbumPayload(request.payload)
    const albumId = await this._service.addAlbums(request.payload)
    const response = h.response({
      status: 'success',
      message: 'Sukses menambahkan album',
      data: {
        albumId
      }
    })
    response.code(201)
    return response
  }

  async getAlbumByIdHandler (request, h) {
    const { id } = request.params
    const album = await this._service.getAlbumsById(id)
    const response = h.response({
      status: 'success',
      data: {
        album
      }
    })
    return response
  }

  async putAlbumByIdHandler (request, h) {
    this._validator.validateAlbumPayload(request.payload)
    const { id } = request.params
    await this._service.editAlbumById(id, request.payload)
    const response = h.response({
      status: 'success',
      message: 'Sukses memperbarui album'
    })
    response.code(200)
    return response
  }

  async deleteAlbumByIdHandler (request, h) {
    const { id } = request.params
    await this._service.deleteAlbumById(id)
    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus album'
    })
    return response
  }
}

module.exports = AlbumHandler
