const Joi = require("joi");

const PlaylistPayloadSchema = {
  name: Joi.string().required(),
  songId: Joi.string().required(),
};

module.exports = PlaylistPayloadSchema;
