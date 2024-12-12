const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;
        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const { id: userId } = request.auth.credentials;
        const addThreadUseCase = this._container.getInstance(ThreadUseCase.name);


        const addedThread = await addThreadUseCase.addThread(request.payload, userId)

        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });

        response.code(201);
        return response;
    }

    async getThreadByIdHandler(request) {
      const { threadId } = request.params;
      const threadUseCase = this._container.getInstance(ThreadUseCase.name);
      const thread = await threadUseCase.getThreadById(threadId);  
  
      return {
          status: 'success',
          data: {
              thread, 
          },
      };
    }

    
}

module.exports = ThreadsHandler;