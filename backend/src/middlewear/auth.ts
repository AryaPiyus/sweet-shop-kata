import { NextFunction } from "express";

export const authToken = (req:Request , res:Response, next:NextFunction)=>{
    next();
}
