declare class BaseException extends Error {
    status: number;
    message: string;
    errorCode: string;
    constructor(status: number, message: string, errorCode: string);
}
export default BaseException;
//# sourceMappingURL=BaseException.d.ts.map