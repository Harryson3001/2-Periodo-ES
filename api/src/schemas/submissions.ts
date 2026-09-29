import { z } from 'zod';

export const contactSchema = z.object({name:z.string().trim().min(2).max(120),email:z.string().email().max(160),phone:z.string().trim().min(8).max(30),message:z.string().trim().min(5).max(4000)});
export const resumeSchema = z.object({name:z.string().trim().min(2).max(120),phone:z.string().trim().min(8).max(30),email:z.string().email().max(160),cargo_desejado:z.string().trim().min(2).max(80),cnh_categoria:z.string().trim().min(1).max(10),experiencia:z.string().trim().min(2).max(3000),disponibilidade:z.string().trim().min(2).max(1000)});
export const aggregateSchema = z.object({name:z.string().trim().min(2).max(120),phone:z.string().trim().min(8).max(30),email:z.string().email().max(160),tipo_veiculo:z.string().trim().min(2).max(80),placa:z.string().trim().min(5).max(12),ano_modelo:z.string().trim().min(4).max(12),tipo_carga:z.string().trim().min(2).max(80),rotas_regioes:z.string().trim().min(2).max(2000),disponibilidade:z.string().trim().min(2).max(1000)});
export const loginSchema = z.object({email:z.string().email(),password:z.string().min(8).max(200)});
export const statusSchema = z.enum(['NEW','IN_PROGRESS','RESOLVED','ARCHIVED']);
