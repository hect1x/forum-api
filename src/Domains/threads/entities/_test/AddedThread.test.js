const AddedThread = require('../AddedThread');

describe('an AddedThread entity', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: 'title only',
        };

        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 1,
            title: 2,
            owner: 3,
        };

        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddedThread object correctly', () => {
        const payload = {
            id: 'id-1',
            title: 'title correct',
            owner: 'user-1',
        };
    
        const { id, title, owner, date } = new AddedThread(payload);
    
        expect(id).toEqual(payload.id);
        expect(title).toEqual(payload.title);
        expect(owner).toEqual(payload.owner);
        expect(typeof date).toBe('string'); 
        expect(new Date(date).toString()).not.toBe('Invalid Date');
    });
});
