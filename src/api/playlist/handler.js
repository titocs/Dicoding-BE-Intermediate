/* eslint-disable camelcase */
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
    this._validator.validatePostPlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { name } = request.payload;

    const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

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
    const playlists = await this._service.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists: playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus playlist',
    });
    response.code(200);
    return response;
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePostSongToPlaylistPayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    await this._service.verifySongIdExist(songId);
    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.addSongToPlaylist(id, songId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan playlist',
    });
    response.code(201);
    return response;
  }

  async getSongInPlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(id, credentialId);
    const songInPlaylist = await this._service.getSongInPlaylist(id);
    return {
      status: 'success',
      data: {
        playlist: songInPlaylist,
      },
    };
  }

  async deleteSongInPlaylistHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deleteSongInPlaylist(id, songId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus lagu dari playlist',
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistHandler;
