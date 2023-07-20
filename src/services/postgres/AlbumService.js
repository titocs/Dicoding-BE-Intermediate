/* eslint-disable no-sequences */
const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const NotFoundError = require('../../exception/NotFoundError')
const InvariantError = require('../../exception/InvariantError')

class AlbumServices {
  constructor (songServices) {
    this._pool = new Pool()
    this._songServices = songServices
  }

  async addAlbums ({ name, year }) {
    const id = `album_${nanoid(16)}`
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year]
    }
    const result = await this._pool.query(query)
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan')
    }
    return result.rows[0].id
  }

  async getAlbumsById (id) {
    const albumQuery = {
      text: 'SELECT id, name, year, cover FROM albums WHERE id = $1',
      values: [id]
    }

    const albumResult = await this._pool.query(albumQuery)
    const songResult = await this._songServices.getSongByAlbumId(id)

    if (!albumResult.rows.length) {
      throw new NotFoundError('Album tidak ditemukan')
    }

    const albumData = {
      id: albumResult.rows[0].id,
      name: albumResult.rows[0].name,
      year: albumResult.rows[0].year,
      coverUrl: albumResult.rows[0].cover,
      songs: songResult.map((song) => ({
        id: song.id,
        title: song.title,
        performer: song.performer
      }))
    }
    return albumData
  }

  async editAlbumById (id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan')
    }
  }

  async deleteAlbumById (id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan')
    }
  }

  async addCoverFile (albumId, fileLocation) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2',
      values: [fileLocation, albumId]
    }
    await this._pool.query(query)
  }
}

module.exports = AlbumServices
