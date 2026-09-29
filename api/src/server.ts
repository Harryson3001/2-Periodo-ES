import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import swaggerUi from 'swagger-ui-express';
import { ZodError } from 'zod';
import { env } from './config/env.js';
import { prisma } from './database/prisma.js';
import publicRoutes from './routes/public.routes.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app=express();
app.use(helmet()); app.use(cors({origin:env.corsOrigins.includes('*')?true:env.corsOrigins,credentials:true})); app.use(express.json({limit:'32kb'})); app.use(express.urlencoded({extended:true,limit:'32kb'})); app.use(morgan('short')); app.use(rateLimit({windowMs:15*60*1000,limit:120,standardHeaders:'draft-8',legacyHeaders:false}));
app.get('/health',async(_req,res)=>{await prisma.$queryRaw`SELECT 1`;res.json({status:'ok',service:'dc-transportes-api',timestamp:new Date().toISOString()})});
app.use('/api/v1',publicRoutes); app.use('/api/v1/admin',authRoutes); app.use('/api/v1/admin',adminRoutes);
app.use('/docs',swaggerUi.serve,swaggerUi.setup({openapi:'3.0.3',info:{title:'DC Transportes API',version:'1.0.0'},paths:{}}));
app.use((_req,res)=>res.status(404).json({error:'Rota não encontrada'}));
app.use((error:unknown,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{if(error instanceof ZodError)return res.status(400).json({error:'Dados inválidos',details:error.issues.map(i=>({field:i.path.join('.'),message:i.message}))});console.error(error);res.status(500).json({error:'Erro interno do servidor'})});
async function bootstrap(){if(env.adminEmail&&env.adminPassword&&await prisma.adminUser.count()===0)await prisma.adminUser.create({data:{email:env.adminEmail,passwordHash:await bcrypt.hash(env.adminPassword,12)}});app.listen(env.port,()=>console.log(`API disponível em http://localhost:${env.port}`))}
bootstrap().catch(async error=>{console.error(error);await prisma.$disconnect();process.exit(1)});
