/* eslint-disable object-shorthand */
class PlaylistHandler {
  constructor (playlistServices, playlistActivitiesServices, validator) {
    this._playlistServices = playlistServices
    this._playlistActivitiesServices = playlistActivitiesServices
    this._validator = validator
  }

  async postPlaylistHandler (request, h) {
    this._validator.validatePostPlaylistPayload(request.payload)
    const { id: credentialId } = request.auth.credentials
    const { name } = request.payload

    const playlistId = await this._playlistServices.addPlaylist({ name, owner: credentialId })

    const response = h.response({
      status: 'success',
      data: {
        playlistId: playlistId
      }
    })
    response.code(201)
    return response
  }

  async getPlaylistsHandler (request) {
    const { id: credentialId } = request.auth.credentials
    const playlists = await this._playlistServices.getPlaylists(credentialId)
    return {
      status: 'success',
      data: {
        playlists: playlists
      }
    }
  }

  async deletePlaylistByIdHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials
    await this._playlistServices.verifyPlaylistOwner(id, credentialId)
    await this._playlistServices.deletePlaylistById(id)

    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus playlist'
    })
    response.code(200)
    return response
  }

  async postSongToPlaylistHandler (request, h) {
    this._validator.validatePostSongToPlaylistPayload(request.payload)
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials
    const { songId } = request.payload
    await this._playlistServices.verifySongIdExist(songId)
    await this._playlistServices.verifyPlaylistAccess(id, credentialId)
    await this._playlistServices.addSongToPlaylist(id, songId)
    await this._playlistActivitiesServices.addActivitiesPOST(id, songId, credentialId)

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan playlist'
    })
    response.code(201)
    return response
  }

  async getSongInPlaylistHandler (request) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials
    await this._playlistServices.verifyPlaylistAccess(id, credentialId)
    const songInPlaylist = await this._playlistServices.getSongInPlaylist(id)
    return {
      status: 'success',
      data: {
        playlist: songInPlaylist
      }
    }
  }

  async deleteSongInPlaylistHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials
    const { songId } = request.payload
    await this._playlistServices.verifyPlaylistAccess(id, credentialId)
    await this._playlistActivitiesServices.addActivitiesDELETE(id, songId, credentialId)
    await this._playlistServices.deleteSongInPlaylist(id, songId)

    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus lagu dari playlist'
    })
    response.code(200)
    return response
  }
}

module.exports = PlaylistHandler
