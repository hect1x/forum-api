const DetailThread = require('../DetailThread');

describe('DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'title example',
      body: 'body example',
      date: '2024-11-24T15:13:47.167333Z',
      username: 'user',
      comments: [], 
    };
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'string id',
      title: 1,  
      body: 1,
      date: 1234,  
      username: 'example user',
      comments: 'not an array',
    };
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when id is not a string', () => {
    const payload = {
      id: 123,  
      title: 'correct title',
      body: 'correct body',
      date: '2024-11-24T15:13:47.167333Z',
      username: 'user',
      comments: [],
    };
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when title is not a string', () => {
    const payload = {
      id: 'correct id',
      title: true,  
      body: 'correct body',
      date: '2024-11-24T15:13:47.167333Z',
      username: 'user',
      comments: [],
    };
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when body is not a string', () => {
    const payload = {
      id: 'correct id',
      title: 'correct title',
      body: {}, 
      date: '2024-11-24T15:13:47.167333Z',
      username: 'user',
      comments: [],
    };
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when date is not a string', () => {
    const payload = {
      id: 'correct id',
      title: 'correct title',
      body: 'correct body',
      date: 123456, 
      username: 'user',
      comments: [],
    };
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when username is not a string', () => {
    const payload = {
      id: 'correct id',
      title: 'correct title',
      body: 'correct body',
      date: '2024-11-24T15:13:47.167333Z',
      username: 123,  
      comments: [],
    };
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when comments is not an array', () => {
    const payload = {
      id: 'correct id',
      title: 'correct title',
      body: 'correct body',
      date: '2024-11-24T15:13:47.167333Z',
      username: 'user',
      comments: 'not an array',
    };
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread object correctly', () => {
    const payload = {
      id: 'correct id',
      title: 'correct title',
      body: 'correct body',
      date: '2024-11-24T15:13:47.167333Z',
      username: 'user',
      comments: [
        {
          id: 'comment-1',
          username: 'commenter',
          date: '2024-11-24T15:13:47.167333Z',
          content: 'comment content',
          isDeleted: false,
        },
      ],
    };
    const { id, title, body, date, username, comments } = new DetailThread(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });
});
