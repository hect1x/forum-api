const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addThread function', () => {
        it('should persist new thread and return added thread correctly', async () => {
            const newThread = new NewThread({
                title: 'title example',
                body: 'body example',
            });

            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            const fakeUserId = 'user-123';
            await UsersTableTestHelper.addUser({ id: fakeUserId });
            const addedThread = await threadRepositoryPostgres.addThread(newThread, fakeUserId);


            expect(addedThread).toHaveProperty('id', 'thread-123');
            expect(addedThread).toHaveProperty('title', newThread.title);
            expect(addedThread).toHaveProperty('owner', fakeUserId);  
            expect(addedThread).toHaveProperty('date');  
            expect(addedThread).toHaveProperty('owner'); 

            const threadInDb = await ThreadsTableTestHelper.findThreadById('thread-123');
            expect(threadInDb).toHaveLength(1); 
            expect(threadInDb[0]).toHaveProperty('id', 'thread-123');
            expect(threadInDb[0]).toHaveProperty('title', newThread.title);
            expect(threadInDb[0]).toHaveProperty('body', newThread.body);
            expect(threadInDb[0]).toHaveProperty('owner', fakeUserId);
        });
    });
    describe('getThreadById function', () => {
      it('should return thread details correctly when thread exists', async () => {
        const threadId = 'thread-123';
        const fakeUserId = 'user-123';
        await UsersTableTestHelper.addUser({
            id: fakeUserId,
            username: 'dicoding',
        });
    
        await ThreadsTableTestHelper.addThread(threadId, {
            title: 'Example Title',
            body: 'Example Body',
        }, fakeUserId);
    
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');
    
        const threadDetails = await threadRepositoryPostgres.getThreadById(threadId);
    
        expect(threadDetails).toHaveProperty('id', threadId);
        expect(threadDetails).toHaveProperty('title', 'Example Title');
        expect(threadDetails).toHaveProperty('body', 'Example Body');
        expect(threadDetails).toHaveProperty('username', 'dicoding');
        expect(threadDetails).toHaveProperty('comments'); 
        expect(Array.isArray(threadDetails.comments)).toBe(true); 
        expect(threadDetails.comments).toHaveLength(0); 
      });
    

        it('should throw NotFoundError when the thread does not exist', async () => {
          const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');
  
          await expect(threadRepositoryPostgres.getThreadById('non-existent-thread'))
              .rejects
              .toThrowError('Thread is not found');
      });
    });

    describe('verifyThreadAvailability function', () => {
        it('should resolve when thread exists', async () => {
          const threadId = 'thread-123';
          const fakeUserId = 'user-123';
      
          await UsersTableTestHelper.addUser({ id: fakeUserId });
          await ThreadsTableTestHelper.addThread(threadId, { title: 'Example Title', body: 'Example Body' }, fakeUserId);
      
          const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');
      
          const isAvailable = await threadRepositoryPostgres.verifyThreadAvailability(threadId);
      
          expect(isAvailable).toBeTruthy();
        });

        it('should throw NotFoundError when the thread does not exist', async () => {
          const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');
  
          await expect(threadRepositoryPostgres.verifyThreadAvailability('non-existent-thread'))
              .rejects
              .toThrowError('Thread is not found');
      });
      });
    
    
});