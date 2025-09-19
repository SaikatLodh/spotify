import { Request } from "express";

export interface RequestWithFile extends Request {
  user?: any;
  file?: Express.Multer.File;
  files?:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] };
}
