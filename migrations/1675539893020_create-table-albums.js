/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(32)',
      primaryKey: true,
    },

    name: {
      type: 'TEXT',
      notNull: true,
    },

    year: {
      type: 'INTEGER',
      notNull: true,
    },

    createdAtt: {
      type: 'TEXT',
      notNull: true,
    },

    updatedAt: {
      type: 'TEXT',
      notNull: true,
    },
  });
};
exports.down = pgm => {
  pgm.dropTable('albums');
};
