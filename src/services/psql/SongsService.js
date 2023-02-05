const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * Manages transaction with DB
 */
class SongsService {
  /**
   * Create connection pool to DB
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * Constructing addSong query and execute it to DB
   */
  async addSong({title, year, genre, performer, duration, albumId}) {
    const id = 'song-' + nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO "songs" VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) '+
            'RETURNING "id"',
      values: [id, title, year, genre, performer, duration, albumId,
               createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add the song');
    }

    return result.rows[0].id;
  }

  /**
   * Constructing getSongById query and execute it to DB
   */
  async getSongs() {
    const result = await this._pool.query('SELECT * FROM "songs"');
    return result.rows;
  }

  /**
   * Constructing getSongById query and execute it to DB
   * @param {string} id
   */
  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM "songs" WHERE "id" = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('song not found');
    }

    return result.rows[0];
  }

  /**
   * Constructing editSongById query and execute it to DB
   * @param {string} id
   * @param {object} {name, year}
   */
  async editSongById(id, {title, year, genre, performer, duration, albumId}) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE "songs" SET '+
            '"title" = $1, '+
            '"year" = $2, '+
            '"genre" = $3, '+
            '"performer" = $4, '+
            '"duration" = $5, '+
            '"albumId" = $6, '+
            '"updatedAt" = $7 '+
            'WHERE "id" = $8 RETURNING "id"',

      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('failed to edit song. ID not found');
    }
  }

  /**
   * Constructing deleteSongById query and execute it to DB
   * @param {string} id
   */
  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM "songs" WHERE "id" = $1 RETURNING "id"',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('failed to delete song. ID not found');
    }
  }
}

module.exports = SongsService;
