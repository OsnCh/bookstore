export class ApplicationException extends Error {
    constructor(message: string) {
        super();
        this.message = message;
    }
}