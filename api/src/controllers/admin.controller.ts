import { Request, Response } from 'express';
import { prisma } from '../database/prisma.js';
import { statusSchema } from '../schemas/submissions.js';

export async function listSubmissions(req:Request,res:Response){const page=Math.max(1,Number(req.query.page??1));const limit=Math.min(100,Math.max(1,Number(req.query.limit??20)));const where={...(req.query.type?{type:String(req.query.type)}:{}),...(req.query.status?{status:String(req.query.status)}:{})};const [data,total]=await Promise.all([prisma.submission.findMany({where,orderBy:{createdAt:'desc'},skip:(page-1)*limit,take:limit}),prisma.submission.count({where})]);res.json({data:data.map(item=>({...item,payload:JSON.parse(item.payload)})),meta:{page,limit,total,pages:Math.ceil(total/limit)}})}
export async function updateStatus(req:Request,res:Response){const nextStatus=statusSchema.parse(req.body.status);const item=await prisma.submission.update({where:{id:String(req.params.id)},data:{status:nextStatus}});res.json(item)}
