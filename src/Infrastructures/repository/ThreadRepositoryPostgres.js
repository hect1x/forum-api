const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../Domains/threads/entities/DetailThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository{
    constructor(pool,idGenerator){
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(newThread, ownerId) {
      const { title, body } = newThread;
      const id = `thread-${this._idGenerator()}`;
      const date = new Date().toISOString(); 
      const query = {
          text: 'INSERT INTO threads (id, title, body, owner, date) VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner, date',
          values: [id, title, body, ownerId, date],
      };
      const result = await this._pool.query(query);
      // console.log(result);
      return new AddedThread({ ...result.rows[0] });
    }
    async getThreadById(threadId) {
      const query = {
          text: `SELECT threads.*, users.username AS username 
                 FROM threads 
                 JOIN users ON threads.owner = users.id 
                 WHERE threads.id = $1`,
          values: [threadId],
      };
      const result = await this._pool.query(query);
  
      if (!result.rowCount) {
          throw new NotFoundError('Thread is not found');
      }
  
      return new DetailThread({
          ...result.rows[0],
          date: new Date(result.rows[0].date).toISOString(),
          comments: [], 
      });
    }

    async verifyThreadAvailability(threadId) {
      // console.log('thsi doesnt exist?')
      const query = {
          text: 'SELECT 1 FROM threads WHERE id = $1',
          values: [threadId],
      };
      const result = await this._pool.query(query);
      if (!result.rowCount) {
        throw new NotFoundError('Thread is not found');
      }
      return result.rowCount > 0;
  }

}

module.exports = ThreadRepositoryPostgres;