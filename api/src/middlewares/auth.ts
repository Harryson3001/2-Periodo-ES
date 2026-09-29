import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function requireAuth(req:Request,res:Response,next:NextFunction) { const token=req.headers.authorization?.replace('Bearer ',''); if(!token)return res.status(401).json({error:'Não autenticado'}); try{jwt.verify(token,env.jwtSecret);next()}catch{return res.status(401).json({error:'Token inválido ou expirado'})} }
