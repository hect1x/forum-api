const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'id-1',
    };
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'this is a string',
      content: 133,
      owner: 121,
    };
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create addedComment object correctly', () => {
    const payload = {
      id: 'is astring',
      content: 'is a string',
      owner: 'is a string',
    };

    const { id, content, owner } = new AddedComment(payload);
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});