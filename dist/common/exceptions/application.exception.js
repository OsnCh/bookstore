"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApplicationException extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
exports.ApplicationException = ApplicationException;
//# sourceMappingURL=application.exception.js.map