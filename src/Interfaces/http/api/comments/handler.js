const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');

class CommentsHandler {
    constructor(container) {
        this._container = container;
        this.postCommentByThreadIdHandler = this.postCommentByThreadIdHandler.bind(this);
        this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this);
    }

    async postCommentByThreadIdHandler(request, h) {
        const { id: userId } = request.auth.credentials;
        const { threadId } = request.params;
        const threadUseCase = this._container.getInstance(ThreadUseCase.name);
        
        const addedComment = await threadUseCase.addCommentByThreadId(request.payload, { userId, threadId });
        
        return h.response({
            status: 'success',
            data: {
                addedComment,
            },
        }).code(201);
    }

    async deleteCommentByIdHandler(request) {
        const { id: userId } = request.auth.credentials;
        const { commentId, threadId } = request.params;
        const threadUseCase = this._container.getInstance(ThreadUseCase.name);
        
        await threadUseCase.deleteComment({ commentId, threadId, userId });
        
        return {
            status: 'success',
        };
    }
}

module.exports = CommentsHandler;
