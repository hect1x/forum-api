const NewThread = require('../NewThread');

describe('a newThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: 'title only',
        };
        expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            title: 1,
            body: 2,
        };
        expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create newThread object correctly', () => {
        const payload ={
            title: 'title correct',
            body: 'body correct',
        };
        const { title, body } = new NewThread(payload);
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
    });
});