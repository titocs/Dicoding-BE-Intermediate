/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql('ALTER TABLE playlists DROP COLUMN username');
};

exports.down = (pgm) => {
  pgm.sql('ALTER TABLE playlists ADD COLUMN username VARCHAR(50)');
};
