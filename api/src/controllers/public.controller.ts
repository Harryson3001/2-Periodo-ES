import { Request, Response } from 'express';
import { prisma } from '../database/prisma.js';
import { contactSchema, resumeSchema, aggregateSchema } from '../schemas/submissions.js';

async function create(type:string,data:Record<string,unknown>){return prisma.submission.create({data:{type,name:String(data.name),email:String(data.email),phone:String(data.phone),payload:JSON.stringify(data)}})}
export async function contact(req:Request,res:Response){const data=contactSchema.parse(req.body);const item=await create('CONTACT',data);res.status(201).json({message:'Mensagem recebida com sucesso',id:item.id})}
export async function resume(req:Request,res:Response){const data=resumeSchema.parse(req.body);const item=await create('RESUME',data);res.status(201).json({message:'Currículo recebido com sucesso',id:item.id})}
export async function aggregate(req:Request,res:Response){const data=aggregateSchema.parse(req.body);const item=await create('AGGREGATE',data);res.status(201).json({message:'Cadastro recebido com sucesso',id:item.id})}
