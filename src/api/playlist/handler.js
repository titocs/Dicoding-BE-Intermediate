/* eslint-disable object-shorthand */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
class PlaylistHandler {
  constructor(service, validator) {
    this._service = service,
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({
      name: request.payload,
      username: credentialId,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      data: {
        playlistId: playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    // await this._service.verifyPlaylistAccess(credentialId);
    const playlists = await this._service.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists: [playlists],
      },
    };
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.deletePlaylistById(id);

    await this._validator.verifyPlaylistOwner(id, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus playlist',
    });
    response.code(200);
    return response;
  }

  // async postSongToPlaylist(request, h) {
  //   const { id } = request.params;
  //   this._validator.validatePlaylistPayload(request.payload);

  // }
}

module.exports = PlaylistHandler;
