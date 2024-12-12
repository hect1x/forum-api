class DetailComment {
    constructor(payload) {
      this._verifyPayload(payload);
      const {
        id, username, date, content, isDeleted,
      } = payload;
  
      this.id = id;
      this.username = username;
      this.date = date;
      //is deleted only passed when a delete request is sent, default is undefined, so no need for checks
      if (isDeleted) {
        this.content = '**komentar telah dihapus**';
      } else {
        this.content = content;
      }
    }
  
    _verifyPayload({
      id, username, date, content, isDeleted,
    }) {
      if (!id || !username || !date || !content) {
        throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
      }
      if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string') {
        throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
  }
module.exports = DetailComment;