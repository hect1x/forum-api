const DetailComment = require('../DetailComment');

describe('DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'user-1',
      date: '2024-11-24T15:13:47.167Z',
    };
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 1,
      username: 1,
      date: '2024-11-24T15:13:47.167Z',
      content: 'a string',
      isDeleted: 'true',  
    };
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailComment object correctly when isDeleted is false', () => {
    const payload = {
      id: 'comment-1',
      username: 'user-1',
      date: '2024-11-24T15:13:47.167Z',
      content: 'correct comment',
      isDeleted: false,
    };
    const { id, username, date, content } = new DetailComment(payload);
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });

  it('should set content to "**komentar telah dihapus**" when isDeleted is true', () => {
    const payload = {
      id: 'comment-1',
      username: 'user-1',
      date: '2024-11-24T15:13:47.167Z',
      content: 'correct comment',
      isDeleted: true, 
    };
    const { content } = new DetailComment(payload);
    expect(content).toEqual('**komentar telah dihapus**');
  });
});