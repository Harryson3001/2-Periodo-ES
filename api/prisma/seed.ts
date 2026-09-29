import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const demoData = [
  {type:'CONTACT',status:'NEW',name:'Mariana Oliveira',email:'mariana.demo@example.com',phone:'(35) 99999-1001',payload:{name:'Mariana Oliveira',email:'mariana.demo@example.com',phone:'(35) 99999-1001',message:'Gostaria de solicitar uma cotação para transporte de carga fracionada entre Minas Gerais e São Paulo.'}},
  {type:'CONTACT',status:'IN_PROGRESS',name:'Carlos Henrique',email:'carlos.demo@example.com',phone:'(11) 98888-2002',payload:{name:'Carlos Henrique',email:'carlos.demo@example.com',phone:'(11) 98888-2002',message:'Preciso acompanhar uma entrega e gostaria de receber informações sobre o prazo estimado.'}},
  {type:'RESUME',status:'NEW',name:'Rafael Mendes',email:'rafael.demo@example.com',phone:'(31) 97777-3003',payload:{name:'Rafael Mendes',email:'rafael.demo@example.com',phone:'(31) 97777-3003',cargo_desejado:'Motorista carreteiro',cnh_categoria:'E',experiencia:'6 anos de experiência com cargas secas e operações rodoviárias.',disponibilidade:'Disponível para viagens nacionais em período integral.'}},
  {type:'RESUME',status:'RESOLVED',name:'Juliana Alves',email:'juliana.demo@example.com',phone:'(34) 96666-4004',payload:{name:'Juliana Alves',email:'juliana.demo@example.com',phone:'(34) 96666-4004',cargo_desejado:'Assistente administrativo',cnh_categoria:'B',experiencia:'Experiência em atendimento, emissão de documentos e suporte logístico.',disponibilidade:'Disponibilidade de segunda a sexta-feira.'}},
  {type:'AGGREGATE',status:'NEW',name:'Transportes Horizonte Demo',email:'horizonte.demo@example.com',phone:'(16) 95555-5005',payload:{name:'Transportes Horizonte Demo',email:'horizonte.demo@example.com',phone:'(16) 95555-5005',tipo_veiculo:'Caminhão toco',placa:'ABC1D23',ano_modelo:'2022 / 2023',tipo_carga:'Carga seca',rotas_regioes:'Sudeste e Centro-Oeste',disponibilidade:'Segunda a sábado, horário comercial.'}},
  {type:'AGGREGATE',status:'IN_PROGRESS',name:'Logística Vale Demo',email:'vale.demo@example.com',phone:'(19) 94444-6006',payload:{name:'Logística Vale Demo',email:'vale.demo@example.com',phone:'(19) 94444-6006',tipo_veiculo:'Carreta baú',placa:'DEF4G56',ano_modelo:'2021 / 2022',tipo_carga:'Produtos paletizados',rotas_regioes:'São Paulo, Paraná e Santa Catarina',disponibilidade:'Disponível para viagens programadas.'}}
];

async function main(){
  const existing=await prisma.submission.count();
  if(existing>0){console.log(`Seed ignorado: já existem ${existing} solicitações.`);return;}
  await prisma.submission.createMany({data:demoData.map(item=>({...item,payload:JSON.stringify(item.payload)}))});
  console.log(`${demoData.length} solicitações demonstrativas inseridas.`);
}

main().catch(console.error).finally(()=>prisma.$disconnect());
