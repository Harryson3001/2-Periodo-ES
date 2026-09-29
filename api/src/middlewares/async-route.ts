import { Request, Response, NextFunction } from 'express';
export const asyncRoute = (handler:(req:Request,res:Response,next:NextFunction)=>Promise<unknown>) => (req:Request,res:Response,next:NextFunction) => Promise.resolve(handler(req,res,next)).catch(next);
