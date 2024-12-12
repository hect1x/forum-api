/* eslint-disable camelcase */
exports.up = (pgm) => {
    pgm.createTable('threads', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      title: {
        type: 'VARCHAR(50)',
      },
      body: {
        type: 'TEXT'
      },
      owner: {
        type: 'VARCHAR(50)',
        references: 'users'
      },
      date: {
        type: 'DATE',
        default: pgm.func('current_timestamp'),
      },
    });
  };
   
  exports.down = (pgm) => {
    pgm.dropTable('threads');
  };