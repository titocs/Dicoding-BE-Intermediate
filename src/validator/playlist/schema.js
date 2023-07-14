const Joi = require('joi');

const PostPlaylistPayloadSchema = {
  name: Joi.string().required(),
};

const PostSongToPlaylistPayloadSchema = {
  songId: Joi.string().required(),
};

const DeleteSongToPlaylistPayloadSchema = {
  songId: Joi.string().required(),
};

module.exports = {
  PostPlaylistPayloadSchema,
  PostSongToPlaylistPayloadSchema,
  DeleteSongToPlaylistPayloadSchema,
};
