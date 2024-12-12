const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
    it('should throw error when invoking abstract behaviours', async () => {
        const threadRepository = new ThreadRepository();


        await expect(threadRepository.addThread({}, '')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(threadRepository.getThreadById('thread-123')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(threadRepository.verifyThreadAvailability('thread-123')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});