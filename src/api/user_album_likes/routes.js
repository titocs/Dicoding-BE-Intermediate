const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.postLikesHandler(request, h),
    options: {
      auth: 'musicapp_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.deleteLikesHandler(request, h),
    options: {
      auth: 'musicapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.getLikesHandler(request, h)
  }
]

module.exports = routes
