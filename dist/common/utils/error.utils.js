"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestException = exports.ConflictException = exports.UnauthorizedException = exports.NotFoundException = void 0;
class NotFoundException extends Error {
    constructor(message) {
        super(message, { cause: 404 });
    }
}
exports.NotFoundException = NotFoundException;
class UnauthorizedException extends Error {
    constructor(message) {
        super(message, { cause: 401 });
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ConflictException extends Error {
    constructor(message) {
        super(message, { cause: 409 });
    }
}
exports.ConflictException = ConflictException;
class BadRequestException extends Error {
    details;
    constructor(message, details) {
        super(message, { cause: 400 });
        this.details = details;
    }
}
exports.BadRequestException = BadRequestException;
