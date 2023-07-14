/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const utils = require('../../utils/index');
const NotFoundError = require('../../exception/NotFoundError');
const InvariantError = require('../../exception/InvariantError');

class SongServices {
  constructor() {
    this._pool = new Pool();
  }

  async addSongs({
    title, year, performer, genre, duration, albumId,
  }) {
    const id = `song_${nanoid()}`;
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSongs(title, performer) {
    const query = {
      text: 'SELECT id, title, performer FROM songs',
      values: [],
    };

    if (title && performer) {
      query.text += ' WHERE title ILIKE $1 AND performer ILIKE $2';
      query.values.push(`%${title}%`, `%${performer}%`);
    } else if (title) {
      query.text += ' WHERE title ILIKE $1';
      query.values.push(`%${title}%`);
    } else if (performer) {
      query.text += ' WHERE performer ILIKE $1';
      query.values.push(`%${performer}%`);
    }

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }
    return result.rows.map(utils.mapSongDBToModel)[0];
  }

  async editSongById(id, {
    title, year, genre, performer, duration, album_id,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, album_id, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongServices;
