/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');
const AuthorizationError = require('../../exception/AuthorizationError');

class PlaylistServices {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
              FROM playlists
              JOIN users ON playlists.owner = users.id WHERE owner = $1`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifySongIdExist(songId) {
    const query = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }
  }

  async addSongToPlaylist(playlist_id, song_id) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3)',
      values: [id, playlist_id, song_id],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyPlaylistAccess(playlistId, userId) {
    await this.verifyPlaylistOwner(playlistId, userId);
    await this._collaborationService.verifyCollaborator(playlistId, userId);
  }

  async getSongInPlaylist(id) {
    const query = {
      text: `SELECT
              playlists.id AS playlist_id,
              playlists.name AS playlist_name,
              users.username,
              songs.id AS song_id,
              songs.title,
              songs.performer
            FROM
              playlists
              INNER JOIN users ON playlists.owner = users.id
              INNER JOIN playlist_songs ON playlists.id = playlist_songs.playlist_id
              INNER JOIN songs ON playlist_songs.song_id = songs.id
            WHERE
              playlists.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlistMap = new Map();
    result.rows.forEach((row) => {
      const playlistId = row.playlist_id;
      if (!playlistMap.has(playlistId)) {
        playlistMap.set(playlistId, {
          id: playlistId,
          name: row.playlist_name,
          username: row.username,
          songs: [],
        });
      }
      const playlist = playlistMap.get(playlistId);
      playlist.songs.push({
        id: row.song_id,
        title: row.title,
        performer: row.performer,
      });
    });

    const playlists = Array.from(playlistMap.values());
    return playlists[0];
  }

  async deleteSongInPlaylist(playlist_id, song_id) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlist_id, song_id],
    };
    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new InvariantError('Playlist tidak ditemukan');
    }
  }
}

module.exports = PlaylistServices;
