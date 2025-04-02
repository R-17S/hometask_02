
import {BlogInputModel} from "./blogTypes";
import {PostInputModel} from "./postTypes";

export type FieldNamesType = keyof BlogInputModel | keyof PostInputModel;

export type ErrorsType = {
    errorsMessage: {message: string, field: FieldNamesType};
}