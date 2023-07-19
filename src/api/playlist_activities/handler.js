class PlaylistActivities {
  constructor (playlistActivitiesServices, playlistServices) {
    this._playlistActivitesServices = playlistActivitiesServices
    this._playlistServices = playlistServices
  }

  async getPlaylistActivitiesHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._playlistServices.verifyPlaylistOwner(id, credentialId)
    const { playlistId, activities } = await this._playlistActivitesServices.getPlaylistActivities(id)

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
        activities
      }
    })
    response.code(200)
    return response
  }
}

module.exports = PlaylistActivities
