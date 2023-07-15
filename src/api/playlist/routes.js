const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: (request, h) => handler.postPlaylistHandler(request, h),
    options: {
      auth: 'musicapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (request, h) => handler.getPlaylistsHandler(request, h),
    options: {
      auth: 'musicapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: (request, h) => handler.deletePlaylistByIdHandler(request, h),
    options: {
      auth: 'musicapp_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.putSongByIdHandler(request, h),
    options: {
      auth: 'musicapp_jwt',
    },
  },
  // {
  //   method: 'GET',
  //   path: '/playlists/{id}/songs',
  //   handler: (request, h) => handler.deleteSongByIdHandler(request, h),
  //   options: {
  //     auth: 'musicapp_jwt',
  //   },
  // },
  // {
  //   method: 'GET',
  //   path: '/playlists/{id}/songs',
  //   handler: (request, h) => handler.deleteSongByIdHandler(request, h),
  //   options: {
  //     auth: 'musicapp_jwt',
  //   },
  // },
];

module.exports = routes;
