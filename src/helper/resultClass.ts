import {ResultStatus} from "../models/result-status.enum";
import {ExtensionType, Result} from "../models/resultTypes";


export class ResultObject {
    static Success<T> (data: T): Result<T> {
        return {
            status: ResultStatus.Success,
            extensions: [],
            data
        };
    }

    static NotFound(message: string, extensions: ExtensionType[] = []): Result<null> {
        return {
            status: ResultStatus.NotFound,
            errorMessage: message,
            extensions,
            data: null
        };
    }

    static Unauthorized(message: string, extensions: ExtensionType[] = []): Result<null> {
        return {
            status: ResultStatus.Unauthorized,
            errorMessage: message,
            extensions,
            data: null
        };
    }

    static Forbidden(message: string, extensions: ExtensionType[] = []): Result<null> {
        return {
            status: ResultStatus.Forbidden,
            errorMessage: message,
            extensions,
            data: null
        };
    }


}