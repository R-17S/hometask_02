import {ResultStatus} from "../models/result-status.enum";
import {Result} from "../models/resultTypes";
import {Response} from "express";


export function resultForHttpException<T>(res: Response, result: Result<T>) {
    switch (result.status) {
        case ResultStatus.Success:
            return res.status(201).json(result);
        case ResultStatus.Unauthorized:
            return res.status(401).json(result);
        case ResultStatus.NotFound:
            return res.status(404).json(result);
        case ResultStatus.Forbidden:
            return res.status(403).json(result);
        case ResultStatus.BadRequest:
            return res.status(400).json(result);
        default:
            return res.status(500).json(result);
    }
}