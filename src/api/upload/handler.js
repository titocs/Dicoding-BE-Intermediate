/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
class UploadHandler {
  constructor (storageServices, albumServices, validator) {
    this._storageServices = storageServices,
    this._albumServices = albumServices,
    this._validator = validator
  }

  async postUploadImageHandler (request, h) {
    const { cover } = request.payload
    const { id } = request.params
    this._validator.validateImageHeaders(cover.hapi.headers)

    const filename = await this._storageServices.writeFile(cover, cover.hapi)
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`
    await this._albumServices.addCoverFile(id, fileLocation)
    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah'
    })
    response.code(201)
    return response
  }
}

module.exports = UploadHandler
