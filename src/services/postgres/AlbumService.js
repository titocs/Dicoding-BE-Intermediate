/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exception/NotFoundError');
const InvariantError = require('../../exception/InvariantError');

class MusicServices {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbums({ name, year }) {
    const id = `album_${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getAlbumsById(id) {
    const query = {
      text: `SELECT albums.id, albums.name, albums.year, songs.id AS song_id, songs.title, songs.performer
              FROM albums
              LEFT JOIN songs ON albums.id = songs.album_id
              WHERE albums.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const albumData = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      year: result.rows[0].year,
      songs: result.rows
        .filter((row) => row.song_id !== null)
        .map((row) => ({
          id: row.song_id,
          title: row.title,
          performer: row.performer,
        })),
    };

    return albumData;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }
}

module.exports = MusicServices;
