const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

const pool = require('../../database/postgres/pool');

const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');


describe('CommentRepository postgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    const commentRepository = new CommentRepositoryPostgres({}, {});
    expect(commentRepository).toBeInstanceOf(CommentRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
      await ThreadTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addCommentByThreadId function', () => {
      it('should add comment to database and return added comment correctly', async () => {
        const content = 'correct content';
        const newComment = new NewComment({
          content,
        });
        const fakeIdGenerator = () => '123'; 
        const fakeUserId = 'user-123';
        const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);
        const threadId = 'thread-123';

        await UsersTableTestHelper.addUser({ id: fakeUserId });
        await ThreadTableTestHelper.addThread(threadId, {
          title: 'title example',
          body: 'body example',
        }, fakeUserId);
  
        const addedComment = await commentRepository
          .addCommentByThreadId(newComment, fakeUserId, threadId);
  
        expect(addedComment).toStrictEqual(new AddedComment({
          id: 'comment-123', 
          content,
          owner: fakeUserId,
        }));

        const comment = await CommentsTableTestHelper.findCommentById('comment-123');
        expect(comment).toHaveLength(1);
        expect(comment[0].content).toBe(content);
        expect(comment[0].owner).toBe(fakeUserId);
        expect(comment[0].thread_id).toBe(threadId);
      });
    });

    describe('getCommentByThreadId function', () => {
      it('should return all comments from a thread with correct owner username and other fields', async () => {
        const userId = 'user-123';
        const threadId = 'thread-123';
        const commentId = 'comment-123';
        
        
        await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
        await ThreadTableTestHelper.addThread(threadId, { title: 'Test Thread', body: 'Test body' }, userId);
        await CommentsTableTestHelper.addComment(commentId, { content: 'This is a comment' }, userId, threadId);
        
        
        const commentRepository = new CommentRepositoryPostgres(pool, {});
        const comments = await commentRepository.getCommentByThreadId(threadId);
    
        
        expect(comments).toHaveLength(1);
    
        // console.log(comments);
        expect(comments[0]).toMatchObject({
          id: 'comment-123', 
          content: 'This is a comment',  
          username: 'dicoding',  
          date: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/), 
        });
    
        
        if (comments[0].isDeleted) {
          expect(comments[0].content).toBe('**komentar telah dihapus**');
        } else {
          
          expect(comments[0].content).toBe('This is a comment');
        }
      });
    });
    

    describe('getCommentOwner function', () => {
      it('should return comment owner if exist', async () => {
        const commentRepository = new CommentRepositoryPostgres(pool, {});
        const userId = 'user-123';
        const threadId = 'thread-123';
        const commentId = 'comment-123';

        await UsersTableTestHelper.addUser({ id: userId });
        await ThreadTableTestHelper.addThread(threadId, {}, userId);
        await CommentsTableTestHelper.addComment(commentId, {}, userId, threadId);

        const owner = await commentRepository.getCommentOwner(commentId);

        await expect(commentRepository.getCommentOwner(commentId))
          .resolves.not.toThrowError(NotFoundError);
        expect(owner).toEqual(userId);
      });
      it('should throw NotFoundError when comment not exist', async () => {
        const commentRepository = new CommentRepositoryPostgres(pool, {});

        await expect(commentRepository.getCommentOwner('comment-123')).rejects.toThrowError(NotFoundError);
      });
    });

    describe('deleteCommentById function', () => {
      it('should remove comment from database if available', async () => {
        const commentRepository = new CommentRepositoryPostgres(pool, {});
        const fakeId = 'comment-123';
        const fakeUserId = 'user-123';
        const fakeThreadId = 'thread-123';
        await UsersTableTestHelper.addUser({ id: fakeUserId });
        await ThreadTableTestHelper.addThread(fakeThreadId, {
          title: 'title exampple',
          body: 'body example',
        }, fakeUserId);
    
        await CommentsTableTestHelper
          .addComment(fakeId, { content: 'isi komentar' }, fakeUserId, fakeThreadId);
        await expect(commentRepository.deleteCommentById(fakeId))
          .resolves.not.toThrow(NotFoundError);
    
        const comment = await CommentsTableTestHelper.findCommentById(fakeId);
        expect(comment).toHaveLength(1); 
        expect(comment[0].is_deleted).toBe(true);
      });
    
      it('should throw error when remove comment with invalid commentId from database', async () => {
        const commentRepository = new CommentRepositoryPostgres(pool, {});
        const fakeId = 'comment-123';
        await expect(commentRepository.deleteCommentById(fakeId)).rejects.toThrow(NotFoundError);
      });
    });


  });
});