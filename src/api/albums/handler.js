/**
 * Handling incoming payload ang generate proper response
 */
class AlbumsHandler {
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
   * Add album to DB
   * @param {request} request
   * @param {h} h
   */
  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const {name, year} = request.payload;

    const albumId = await this._service.addAlbum({name, year});

    const response = h.response(
        {
          status: 'success',
          data: {
            albumId,
          },
        },
    );

    response.code(201);
    return response;
  }

  /**
   * Get album from DB by ID
   * @param {request} request
   * @param {h} h
   */
  async getAlbumByIdHandler(request, h) {
    const {id} = request.params;
    const album = await this._service.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album: {
          id: album['id'],
          name: album['name'],
          year: album['year'],
        },
      },
    };
  }

  /**
   * Get album from DB by ID
   * @param {request} request
   * @param {h} h
   */
  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const {id} = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'album successfully edited',
    };
  }

  /**
   * Delete album from DB by ID
   * @param {request} request
   * @param {h} h
   */
  async deleteAlbumByIdHandler(request, h) {
    const {id} = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'album successfully deleted',
    }
  }
}

module.exports = AlbumsHandler;
