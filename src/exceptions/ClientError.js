/**
 * Creating base of error generated from client
 */
class ClientError extends Error {
  /**
   * Handling error message returning
   * @param {string} message containing error message
   * @param {number} statusCode containing error code, default to 400 at it is
   */
  constructor(message, statusCode = 400) {
    super(message),
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

module.exports = ClientError;
