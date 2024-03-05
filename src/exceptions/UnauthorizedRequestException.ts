import BaseException from "./BaseException";
 
class UnauthorizedRequestException extends BaseException {
  constructor() {
    super(401, "User is unauthorized" ,"UNAUTHORIZATION_ERROR");
  }
}
 
export default UnauthorizedRequestException;