/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('comments', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      owner: {
        type: 'VARCHAR(50)',
        references: '"users"',
      },   
      date: {
        type: 'DATE',
        default: pgm.func('current_timestamp'),
      },         
      content: {
        type: 'TEXT',
      },
      is_deleted: {
        type: 'BOOLEAN',
        default: 'false',
      },      
      thread_id: {
        type: 'VARCHAR(50)',
        references: '"threads"',
      },
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('comments');
  };