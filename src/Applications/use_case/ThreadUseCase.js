const NewThread = require('../../Domains/threads/entities/NewThread');
const NewComment = require('../../Domains/comments/entities/NewComment');
const DetailThread = require('../../Domains/threads/entities/DetailThread');
const DetailComment =  require('../../Domains/comments/entities/DetailComment');
class ThreadUseCase{
    constructor( {threadRepository, commentRepository} ){
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async addThread(useCasePayload, ownerId) {
        const newThread = new NewThread(useCasePayload);
        return this._threadRepository.addThread(newThread, ownerId);
    }

    async addCommentByThreadId( useCasePayload, { userId, threadId }){
        // console.log('this was called')
        await this._threadRepository.verifyThreadAvailability(threadId);
        // console.log('check1')
        const newComment = new NewComment(useCasePayload);
        // console.log('check2');
        const result = await this._commentRepository.addCommentByThreadId(newComment, userId, threadId);
        // console.log('check3');
        return result;
    }

    async getThreadById(threadId) {
        const comments = await this._commentRepository.getCommentByThreadId(threadId); 
        const thread = await this._threadRepository.getThreadById(threadId); 
        return new DetailThread({
            ...thread,
            comments: comments.map(comment => new DetailComment(comment)),
        });
    }

    async deleteComment( {commentId, threadId, userId }){
        const ownerId = await this._commentRepository.getCommentOwner(commentId);
        if(ownerId !== userId){
            throw new Error('INVALID_OWNER');
        }
        await this._threadRepository.verifyThreadAvailability(threadId);
        await this._commentRepository.deleteCommentById(commentId);
    }
}

module.exports = ThreadUseCase;