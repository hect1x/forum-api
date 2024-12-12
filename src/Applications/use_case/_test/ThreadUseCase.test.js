const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

const ThreadUseCase = require('../ThreadUseCase');

const NewThread = require('../../../Domains/threads/entities/NewThread');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');

const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');

describe('ThreadUseCase', () => {
  it('should orchestrate the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'title thread example',
      body: 'body thread example',
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest.fn().mockResolvedValue(
      new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: 'user-123',
        date: '2024-11-29T00:00:00Z',
      })
    );
  

    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
    });
  

    const addedThread = await threadUseCase.addThread(useCasePayload, 'user-123');

    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: 'user-123',
        date: expect.any(String),
      })
    );
  
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      }),
      'user-123'
    );
  });

  it('should orchestrate the get thread by id action correctly', async () => {
    const expectedThreadDetails = new DetailThread({
      id: 'thread-123',
      title: 'title example',
      body: 'body example',
      username: 'username example',
      date: '2024-11-27T00:00:00Z',
      comments: [
        new DetailComment({
          id: 'comment-1',
          username: 'user1',
          date: '2024-11-27T00:00:00Z',
          content: 'This is a comment',
          isDeleted: false,
        }),
        new DetailComment({
          id: 'comment-2',
          username: 'user2',
          date: '2024-11-27T00:00:00Z',
          content: 'Another comment',
          isDeleted: false,
        }),
      ],
    });
    
    const mockThread = new DetailThread({
      id: 'thread-123',
      title: 'title example',
      body: 'body example',
      username: 'username example',
      date: '2024-11-27T00:00:00Z',
      comments: [],
    });
  
    const mockComments = [
      new DetailComment({
        id: 'comment-1',
        username: 'user1',
        date: '2024-11-27T00:00:00Z',
        content: 'This is a comment',
        isDeleted: false,
      }),
      new DetailComment({
        id: 'comment-2',
        username: 'user2',
        date: '2024-11-27T00:00:00Z',
        content: 'Another comment',
        isDeleted: false,
      }),
    ];
  
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(mockThread);
  
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentByThreadId = jest.fn().mockResolvedValue(mockComments);
  
    const getThreadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
  
    const threadId = 'thread-123';
    const threadDetails = await getThreadUseCase.getThreadById(threadId);
  
    expect(threadDetails).toStrictEqual(expectedThreadDetails);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(threadId);
  });
  

  it('should orchestrate the add comment action correctly', async () => {
    const useCasePayload = { content: 'content example' };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'content example',
      owner: 'user-123',
    });

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.addCommentByThreadId = jest.fn()
    .mockResolvedValue(new AddedComment({
      id: 'comment-123',
      content: 'content example',
      owner: 'user-123',
    }));

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockResolvedValue(true);

    const getThreadUseCase = new ThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const userId = 'user-123';
    const threadId = 'thread-123';
    const addedComment = await getThreadUseCase.addCommentByThreadId(useCasePayload, { userId, threadId });

    expect(addedComment).toStrictEqual(mockAddedComment);

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(threadId);
    expect(mockCommentRepository.addCommentByThreadId).toBeCalledWith(
      new NewComment(useCasePayload),
      userId,
      threadId,
    );
  });

  it('should orchestrate the delete comment action correctly', async () => {
    const userId = 'user-123';
    const commentId = 'comment-123';
    const threadId = 'thread-123';

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockResolvedValue(true);

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentOwner = jest.fn()
      .mockResolvedValue(userId);
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockResolvedValue();

    const getThreadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await getThreadUseCase.deleteComment({ commentId, threadId, userId });

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentOwner).toBeCalledWith(commentId);
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(commentId);
  });

  it('should throw error when invalid owner', async () => {
    const userId = 'user-123';
    const fakeId = 'user-1';
    const commentId = 'comment-123';
    const threadId = 'thread-123';

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentOwner = jest.fn()
      .mockResolvedValue(userId);

    const getThreadUseCase = new ThreadUseCase({
      commentRepository: mockCommentRepository,
    });

    await expect(getThreadUseCase.deleteComment({ commentId, threadId, fakeId })).rejects.toThrowError(Error);

    expect(mockCommentRepository.getCommentOwner).toBeCalledWith(commentId);
  });

  it('should throw error when thread is not found', async () => {
    const threadId = 'non-existing';
    
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreadById = jest.fn()
      .mockRejectedValue(new Error('Thread not found'));  

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockResolvedValue([]); 

    const getThreadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
    });

    await expect(getThreadUseCase.getThreadById(threadId))
      .rejects
      .toThrowError('Thread not found');

    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(threadId);
  });
});
