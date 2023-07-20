/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exception/InvariantError')

class UserAlbumLikes {
  constructor (cacheServices) {
    this._pool = new Pool(),
    this._cacheServices = cacheServices
  }

  async addLikes (userId, albumId) {
    const id = `likes-${nanoid(16)}`

    const userLiked = await this.checkUserLikedAlbum(userId)
    if (userLiked.length > 0) {
      throw new InvariantError('User telah melakukan likes')
    }

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3)',
      values: [id, userId, albumId]
    }
    const result = await this._pool.query(query)
    await this._cacheServices.delete(`playlists:${albumId}`)
    return result.rows
  }

  async deleteLikes (albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId]
    }
    const result = await this._pool.query(query)
    await this._cacheServices.delete(`playlists:${albumId}`)
    return result.rows
  }

  async getLikes (albumId) {
    try {
      const result = await this._cacheServices.get(`playlists:${albumId}`)
      return {
        likes: JSON.parse(result),
        dataSource: 'cache'
      }
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(id) FROM user_album_likes WHERE album_id = $1',
        values: [albumId]
      }
      const result = await this._pool.query(query)
      const likesCount = parseInt(result.rows[0].count, 10)
      await this._cacheServices.set(`playlists:${albumId}`, JSON.stringify(likesCount))
      return {
        likes: likesCount,
        dataSource: 'database'
      }
    }
  }

  async checkUserLikedAlbum (userId) {
    const query = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1',
      values: [userId]
    }
    const result = await this._pool.query(query)
    return result.rows
  }
}

module.exports = UserAlbumLikes
