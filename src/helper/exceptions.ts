

export class HttpException extends Error {
    constructor(
        public readonly status: number,
        message: string,
    ) {
        super(message);
        Object.setPrototypeOf(this, HttpException.prototype);
    }
}

export class NotFoundException extends HttpException {
    constructor(message = "Not Found") {
        super(404, message);
    }
}

export class ForbiddenException extends HttpException {
    constructor(message = 'Forbidden') {
        super(403, message);
    } // стоит ли засовывать в валидатор вместо обычных ошибок, если тут логика ошибки в непредвиденных ?
}

export class UnauthorizedException extends HttpException {
    constructor(message = 'Unauthorized') {
        super(401, message);
    } // стоит ли засовывать в валидатор вместо обычных ошибок, если тут логика ошибки в непредвиденных ?
}

export class BadRequestException extends HttpException {
    constructor(message = 'Bad Request') {
        super(400, message);
    }  // стоит ли засовывать в валидатор вместо обычных ошибок, если тут логика ошибки в непредвиденных ?
}

// export class ServerErrorException extends HttpException {
//     constructor(message = "Internal Server Error") {
//         super(500, message);
//     }
// }


