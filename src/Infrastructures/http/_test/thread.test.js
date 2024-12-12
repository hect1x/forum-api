const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    })

    describe('when POST /threads', () => {
        it('sould response 201 and persisted threads', async () => {
            const requestPayload = {
                title: 'title example',
                body: 'body example',
            };

            await UsersTableTestHelper.addUser( {id: 'user-123'} );

            const server = await createServer(container);

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                auth: {
                    strategy: 'forum_jwt',
                    credentials: {
                        id : 'user-123'
                    },
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined;
        });
    });

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response 201 and persisted comments', async () => {
          const userId = 'user-123';
          const threadId = 'thread-123';
          const requestPayload = {
            content: 'correct content',
          };
    
          await UsersTableTestHelper.addUser({ id: userId });
          await ThreadsTableTestHelper.addThread(threadId, { }, userId);
    
          const server = await createServer(container);
          const response = await server.inject({
            method: 'POST',
            url: `/threads/${threadId}/comments`,
            payload: requestPayload,
            auth: {
              strategy: 'forum_jwt',
              credentials: {
                id: userId,
              },
            },
          });
    
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(201);
          expect(responseJson.status).toEqual('success');
          expect(responseJson.data.addedComment).toBeDefined();
        });
    });

    describe('when GET /threads/{threadId}', () => {
      it('should respond 200 and return thread details', async () => {
        // Arrange
        const thread = {
          id: 'thread-123',
          date: new Date().toISOString(),
        };
      
        // Add user
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        // Add thread
        await ThreadsTableTestHelper.addThread(thread.id, {}, 'user-123');
      
        // Action
        const server = await createServer(container);
        const response = await server.inject({
          method: 'GET',
          url: `/threads/${thread.id}`,
        });
      
        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(200);
        expect(responseJson.status).toEqual('success');
        expect(responseJson.data.thread).toBeTruthy();
        expect(responseJson.data.thread.id).toStrictEqual(thread.id);
        expect(responseJson.data.thread.title).toStrictEqual('title example');
        expect(responseJson.data.thread.body).toStrictEqual('body example');
      });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should response 200', async () => {
          const userId = 'user-123';
          const threadId = 'thread-123';
          const commentId = 'comment-123';
    
          await UsersTableTestHelper.addUser({ id: userId });
          await ThreadsTableTestHelper.addThread(threadId, {}, userId);
          await CommentsTableTestHelper.addComment(commentId, {}, userId, threadId);
    
          const server = await createServer(container);
          const response = await server.inject({
            method: 'DELETE',
            url: `/threads/${threadId}/comments/${commentId}`,
            auth: {
              strategy: 'forum_jwt',
              credentials: {
                id: userId,
              },
            },
          });
    
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(200);
          expect(responseJson.status).toEqual('success');
        });
    });
})