import 'dotenv/config';
import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {PrismaClient} from '@prisma/client';
import {z, ZodError} from 'zod';
import swaggerUi from 'swagger-ui-express';

const prisma = new PrismaClient();
const app = express();
const port = Number(process.env.PORT ?? 3333);
const secret = process.env.JWT_SECRET ?? 'development-secret-change-me';
const origins = (process.env.FRONTEND_URL ?? '*').split(',').map(v => v.trim());

app.use(helmet());
app.use(cors({origin: origins.includes('*') ? true : origins, credentials: true}));
app.use(express.json({limit:'32kb'}));
app.use(express.urlencoded({extended:true, limit:'32kb'}));
app.use(morgan('short'));
app.use(rateLimit({windowMs: 15*60*1000, limit: 120, standardHeaders:'draft-8', legacyHeaders:false}));

const contact = z.object({name:z.string().trim().min(2).max(120), email:z.string().email().max(160), phone:z.string().trim().min(8).max(30), message:z.string().trim().min(5).max(4000)});
const resume = z.object({name:z.string().trim().min(2).max(120), phone:z.string().trim().min(8).max(30), email:z.string().email().max(160), cargo_desejado:z.string().trim().min(2).max(80), cnh_categoria:z.string().trim().min(1).max(10), experiencia:z.string().trim().min(2).max(3000), disponibilidade:z.string().trim().min(2).max(1000)});
const aggregate = z.object({name:z.string().trim().min(2).max(120), phone:z.string().trim().min(8).max(30), email:z.string().email().max(160), tipo_veiculo:z.string().trim().min(2).max(80), placa:z.string().trim().min(5).max(12), ano_modelo:z.string().trim().min(4).max(12), tipo_carga:z.string().trim().min(2).max(80), rotas_regioes:z.string().trim().min(2).max(2000), disponibilidade:z.string().trim().min(2).max(1000)});
const login = z.object({email:z.string().email(), password:z.string().min(8).max(200)});
const status = z.enum(['NEW','IN_PROGRESS','RESOLVED','ARCHIVED']);

function asyncRoute(fn:(req:Request,res:Response,next:NextFunction)=>Promise<unknown>) { return (req:Request,res:Response,next:NextFunction) => Promise.resolve(fn(req,res,next)).catch(next); }
function createSubmission(type:string, data:Record<string,unknown>) { return prisma.submission.create({data:{type,name:String(data.name),email:String(data.email),phone:String(data.phone),payload:JSON.stringify(data)}}); }
function auth(req:Request,res:Response,next:NextFunction) { const token = req.headers.authorization?.replace('Bearer ',''); if (!token) return res.status(401).json({error:'Não autenticado'}); try { jwt.verify(token,secret); next(); } catch { return res.status(401).json({error:'Token inválido ou expirado'}); } }

app.get('/health', asyncRoute(async (_req,res) => { await prisma.$queryRaw`SELECT 1`; res.json({status:'ok', service:'dc-transportes-api', timestamp:new Date().toISOString()}); }));
app.post('/api/v1/contact', asyncRoute(async (req,res) => { const data=contact.parse(req.body); const item=await createSubmission('CONTACT',data); res.status(201).json({message:'Mensagem recebida com sucesso', id:item.id}); }));
app.post('/api/v1/applications/resume', asyncRoute(async (req,res) => { const data=resume.parse(req.body); const item=await createSubmission('RESUME',data); res.status(201).json({message:'Currículo recebido com sucesso', id:item.id}); }));
app.post('/api/v1/applications/aggregate', asyncRoute(async (req,res) => { const data=aggregate.parse(req.body); const item=await createSubmission('AGGREGATE',data); res.status(201).json({message:'Cadastro recebido com sucesso', id:item.id}); }));
app.post('/api/v1/admin/login', asyncRoute(async (req,res) => { const data=login.parse(req.body); const user=await prisma.adminUser.findUnique({where:{email:data.email}}); if (!user || !await bcrypt.compare(data.password,user.passwordHash)) return res.status(401).json({error:'Credenciais inválidas'}); res.json({token:jwt.sign({sub:user.id,email:user.email},secret,{expiresIn:'8h'})}); }));
app.get('/api/v1/admin/submissions', auth, asyncRoute(async (req,res) => { const page=Math.max(1,Number(req.query.page??1)); const limit=Math.min(100,Math.max(1,Number(req.query.limit??20))); const where={...(req.query.type ? {type:String(req.query.type)}:{}), ...(req.query.status ? {status:String(req.query.status)}:{})}; const [data,total]=await Promise.all([prisma.submission.findMany({where,orderBy:{createdAt:'desc'},skip:(page-1)*limit,take:limit}),prisma.submission.count({where})]); res.json({data:data.map(x=>({...x,payload:JSON.parse(x.payload)})),meta:{page,limit,total,pages:Math.ceil(total/limit)}}); }));
app.patch('/api/v1/admin/submissions/:id/status', auth, asyncRoute(async (req,res) => { const parsed=status.parse(req.body.status); const item=await prisma.submission.update({where:{id:String(req.params.id)},data:{status:parsed}}); res.json(item); }));

const openapi={openapi:'3.0.3',info:{title:'DC Transportes API',version:'1.0.0'},servers:[{url:'/'}],paths:{'/health':{get:{summary:'Status da API'}},'/api/v1/contact':{post:{summary:'Enviar contato'}},'/api/v1/applications/resume':{post:{summary:'Enviar currículo'}},'/api/v1/applications/aggregate':{post:{summary:'Cadastrar agregado'}},'/api/v1/admin/login':{post:{summary:'Login administrativo'}}}};
app.use('/docs',swaggerUi.serve,swaggerUi.setup(openapi));
app.use((_req,res)=>res.status(404).json({error:'Rota não encontrada'}));
app.use((err:unknown,_req:Request,res:Response,_next:NextFunction)=>{ if(err instanceof ZodError) return res.status(400).json({error:'Dados inválidos',details:err.issues.map(i=>({field:i.path.join('.'),message:i.message}))}); console.error(err); res.status(500).json({error:'Erro interno do servidor'}); });

async function bootstrap(){ const email=process.env.ADMIN_EMAIL; const password=process.env.ADMIN_PASSWORD; if(email && password && await prisma.adminUser.count()===0) await prisma.adminUser.create({data:{email,passwordHash:await bcrypt.hash(password,12)}}); app.listen(port,()=>console.log(`API disponível em http://localhost:${port}`)); }
bootstrap().catch(async err=>{console.error(err);await prisma.$disconnect();process.exit(1);});
