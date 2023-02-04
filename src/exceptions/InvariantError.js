const ClientError = require('./ClientError');

/**
 * Custom error for improper payload format
 */
class InvariantError extends ClientError {
  /**
   * Handling error message returning
   * @param {string} message containing erorr message
   */
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;
