const ClientError = require('./ClientError');

/**
 * Custom error for accessing not defined route
 */
class NotFoundError extends ClientError {
  /**
   * Handling error message returning
   * @param {string} message containing error message
   */
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
