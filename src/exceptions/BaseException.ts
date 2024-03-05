class BaseException extends Error {
    status: number;
    message: string;
    errorCode: string;
    constructor(status: number, message: string,errorCode: string) {
      super(message);
      this.status = status;
      this.message = message;
      this.errorCode=errorCode;
    }
  }
   
  export default BaseException;