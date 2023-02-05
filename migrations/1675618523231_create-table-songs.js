/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(32)',
      primaryKey: true,
    },

    title: {
      type: 'TEXT',
      notNull: true,
    },

    year: {
      type: 'INTEGER',
      notNull: true,
    },

    genre: {
      type: 'TEXT',
      notNull: true,
    },

    performer: {
      type: 'TEXT',
      notNull: true,
    },

    duration: {
      type: 'INTEGER',
    },

    albumId: {
      type: 'TEXT',
    },

    createdAt: {
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
  pgm.dropTable('songs');
};
