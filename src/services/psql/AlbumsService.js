const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * Manages transaction with DB
 */
class AlbumsService {
  /**
   * Create connection pool to DB
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * Constructing addAlbum query and execute it to DB
   */
  async addAlbum({name, year}) {
    const id = 'album-' + nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO "albums" VALUES($1, $2, $3, $4, $5) RETURNING "id"',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add the album');
    }

    return result.rows[0].id;
  }

  /**
   * Constructing getAlbumById query and execute it to DB
   * @param {string} id
   */
  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM "albums" WHERE "id" = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('album not found');
    }

    return result.rows[0];
  }

  /**
   * Constructing editAlbumById query and execute it to DB
   * @param {string} id
   */
  async getAlbumSongsById(id) {
    const query = {
      text: 'SELECT songs.id, songs.title, songs.performer, "albumId"'+
            'FROM "songs"'+
            'JOIN "albums" '+
            'ON "albumId" = albums.id '+
            'WHERE albums.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    // if (!result.rows.length) {
    //   throw new NotFoundError('album not found');
    // }

    return result.rows;
  }

  /**
   * Constructing editAlbumById query and execute it to DB
   * @param {string} id
   * @param {object} {name, year}
   */
  async editAlbumById(id, {name, year}) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE "albums" SET "name" = $1, "year" = $2, "updatedAt" = $3 '+
            'WHERE "id" = $4 RETURNING "id"',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('failed to edit album. ID not found');
    }
  }

  /**
   * Constructing deleteAlbumById query and execute it to DB
   * @param {string} id
   */
  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM "albums" WHERE "id" = $1 RETURNING "id"',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('failed to delete album. ID not found');
    }
  }
}

module.exports = AlbumsService;
