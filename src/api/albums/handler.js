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
   * Responsible for add album to DB
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
}

module.exports = AlbumsHandler;