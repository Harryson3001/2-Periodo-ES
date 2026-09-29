import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../database/prisma.js';
import { env } from '../config/env.js';
import { loginSchema } from '../schemas/submissions.js';

export async function login(req:Request,res:Response){const data=loginSchema.parse(req.body);const user=await prisma.adminUser.findUnique({where:{email:data.email}});if(!user||!await bcrypt.compare(data.password,user.passwordHash))return res.status(401).json({error:'Credenciais inválidas'});res.json({token:jwt.sign({sub:user.id,email:user.email},env.jwtSecret,{expiresIn:'8h'})})}
