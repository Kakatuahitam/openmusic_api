/**
 * Handling incoming payload ang generate proper response
 */
class SongsHandler {
  /**
   * Initializing service and validator for payload management
   * @param {service} service
   * @param {validator} validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  /**
   * Add song to DB
   * @param {request} request
   * @param {h} h
   */
  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {title, year, genre, performer, duration, albumId} = request.payload;

    const songId = await this._service.addSong(
      {title, year, genre, performer, duration, albumId}
    );

    const response = h.response(
        {
          status: 'success',
          data: {
            songId,
          },
        },
    );

    response.code(201);
    return response;
  }

  /**
   * Get all songs from DB
   */
  async getSongsHandler() {
    const fullSongs = await this._service.getSongs();
    const songs = fullSongs.map(item => {
      const container = {
        id: item.id,
        title: item.title,
        performer: item.performer,
      }

      return container;
    });

    console.log(songs);
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  /**
   * Get song from DB by ID
   * @param {request} request
   * @param {h} h
   */
  async getSongByIdHandler(request, h) {
    const {id} = request.params;
    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  /**
   * Get song from DB by ID
   * @param {request} request
   * @param {h} h
   */
  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {id} = request.params;

    await this._service.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'song successfully edited',
    };
  }

  /**
   * Delete song from DB by ID
   * @param {request} request
   * @param {h} h
   */
  async deleteSongByIdHandler(request, h) {
    const {id} = request.params;
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'song successfully deleted',
    }
  }
}

module.exports = SongsHandler;
