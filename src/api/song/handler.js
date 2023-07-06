/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
class SongHandler {
  constructor(service, validator) {
    this._service = service,
    this._validator = validator;
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {
      title, year, performer, genre, duration = null, albumId = null,
    } = request.payload;

    const songId = await this._service.addSongs({
      title, year, genre, performer, duration, albumId,
    });

    const response = h.response({
      status: 'success',
      message: 'Sukses menambahkan song',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongHandler(request, h) {
    const { title, performer } = request.query;
    const songs = await this._service.getSongs(title, performer);

    const response = h.response({
      status: 'success',
      data: {
        songs,
      },
    });
    response.code(200);
    return response;
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    const response = h.response({
      status: 'success',
      data: {
        song,
      },
    });
    response.code(200);
    return response;
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;

    await this._service.editSongById(id, request.payload);

    const response = h.response({
      status: 'success',
      message: 'Sukses memperbarui song',
    });
    response.code(200);
    return response;
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus song',
    });
    response.code(200);
    return response;
  }
}

module.exports = SongHandler;
