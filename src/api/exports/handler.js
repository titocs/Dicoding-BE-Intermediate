/* eslint-disable object-shorthand */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
class ExportHandler {
  constructor (exportServices, playlistServices, validator) {
    this._exportServices = exportServices,
    this._playlistServices = playlistServices,
    this._validator = validator
  }

  async postExportPlaylistHandler (request, h) {
    this._validator.validateExportPlaylistPayload(request.payload)
    const { id: credentialId } = request.auth.credentials
    const { playlistId } = request.params
    const message = {
      playlistId: playlistId,
      targetEmail: request.payload.targetEmail
    }
    await this._playlistServices.verifyPlaylistAccess(playlistId, credentialId)
    await this._exportServices.sendMessage('export:playlists', JSON.stringify(message))

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean'
    })
    response.code(201)
    return response
  }
}

module.exports = ExportHandler
