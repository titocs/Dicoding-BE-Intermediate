class UploadHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator
  }

  async postUploadImageHandler (request, h) {
    const { data } = request.payload
    const { id } = request.params
    // id nya itu albumId
    this._validator.validateImageHeaders(data.hapi.headers)

    const filename = await this._service.writeFile(data, data.hapi)
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`
    await this._albumServices.addCoverFile(id, fileLocation)
    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah'
      // data: {
      //   fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`
      // }
    })
    console.log(response)
    response.code(201)
    return response
  }
}

module.exports = UploadHandler
