/* eslint-disable object-shorthand */
/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exception/NotFoundError');

class PlaylistActivitiesServices {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistActivities(idPlaylist) {
    const query = {
      text: `SELECT
              playlists.id AS playlist_id, users.username, songs.title, psa.action, psa.time
            FROM playlists
            JOIN playlist_song_activities AS psa ON playlists.id = psa.playlist_id
            JOIN songs ON psa.song_id = songs.id
            JOIN users ON psa.user_id = users.id
            WHERE playlists.id = $1`,
      values: [idPlaylist],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Tidak ada playlist');
    }
    const playlistId = result.rows[0].playlist_id;
    const activities = result.rows.map((row) => ({
      username: row.username,
      title: row.title,
      action: row.action,
      time: row.time,
    }));

    return {
      playlistId,
      activities,
    };
  }

  async addActivitiesPOST(playlistId, songId, userId) {
    const action = 'add';
    const time = new Date().toISOString();
    const id = `playlistActivities-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, playlistId, songId, userId, action, time],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async addActivitiesDELETE(playlistId, songId, userId) {
    const action = 'delete';
    const time = new Date().toISOString();
    const id = `playlistActivities-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, playlistId, songId, userId, action, time],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistActivitiesServices;
