const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
// const NotFoundError = require('../../exceptions/NotFoundError');


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
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add the album');
    }

    return result.rows[0].id;
  }
}

module.exports = AlbumsService;
