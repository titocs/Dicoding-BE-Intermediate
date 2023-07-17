/* eslint-disable object-shorthand */
/* eslint-disable no-underscore-dangle */
class CollaborationHandler {
  constructor(collaborationServices, playlistServices, validator) {
    this._collaborationServices = collaborationServices;
    this._playlistServices = playlistServices;
    this._validator = validator;
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistServices.verifyPlaylistOwner(playlistId, credentialId);
    const collaborationId = await this._collaborationServices.addCollaboration(playlistId, userId);
    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId: collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistServices.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationServices.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationHandler;
