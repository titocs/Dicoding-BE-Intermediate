/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('albums', {
    cover: {
      type: 'VARCHAR(200)'
    }
  })
}

exports.down = (pgm) => {
  pgm.dropColumn('albums', 'cover')
}
