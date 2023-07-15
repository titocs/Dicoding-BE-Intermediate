/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql('ALTER TABLE playlists DROP COLUMN username');
};

exports.down = (pgm) => {};
