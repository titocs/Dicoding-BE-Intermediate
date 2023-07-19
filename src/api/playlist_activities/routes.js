const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: (request, h) => handler.getPlaylistActivitiesHandler(request, h),
    options: {
      auth: 'musicapp_jwt'
    }
  }
]

module.exports = routes
