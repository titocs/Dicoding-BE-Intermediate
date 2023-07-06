/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNUll: true,
    },
    year: {
      type: 'INTEGER',
      notNUll: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('albums');
};
