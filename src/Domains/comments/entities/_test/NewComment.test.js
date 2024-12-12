const NewComment = require('../NewComment');

describe('NewComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: 'only title',
        };
        expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });
    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            content: 1,
        };
        expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
    it('should create new comment correctly', () => {
        const payload = {
            content: 'correct string',
        };
        const { content } = new NewComment(payload);
        expect(content).toEqual(payload.content);
    });
});