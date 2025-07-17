import {ResultStatus} from "./result-status.enum";
import {Result} from "./resultTypes";
import {Response} from "express";


export function resultForHttpException<T>(res: Response, result: Result<T>) {
    switch (result.status) {
        case ResultStatus.Success:
            return res.status(201).json(result);
        case ResultStatus.Unauthorized:
            return res.status(401).json(result);
        case ResultStatus.NotFound:
            return res.status(404).json({ errorsMessage: result.extensions });
        case ResultStatus.Forbidden:
            return res.status(403).json({ errorsMessage: result.extensions });
        case ResultStatus.BadRequest:
            return res.status(400).json(result);
        default:
            return res.status(500).json(result);
    }
}

// if (result.data === undefined) {
//     return res.status(204).send(); // UPDATE/DELETE
// }

// try {
//     const updateBlog = await blogsService.updateBlog(req.params.id, req.body);
//     resultForHttpException(res, updateBlog);
// } catch (error) {
//     const errorResult = ResultObject.ServerError(
//         'Update failed',
//         [{field: null, message: 'Database error'}]
//     );
//     resultForHttpException(res, errorResult);
// }
// };

//     const updateBlog = await blogsRepository.updateBlog(id, input);
//     if (!updateBlog) {
//     return ResultObject.NotFound("Blog not update", [
//         { field: "id", message: "Blog with this ID validated but not found in collection" },
//     ]);
// }
// return ResultObject.Success(undefined);
// },
